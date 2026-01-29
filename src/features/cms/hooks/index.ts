"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

import { cmsApi } from "../api/cmsApi";
import type {
  IMarketingContent,
  IContentCategory,
  IContentTag,
  IContentFilters,
  ICategoryFilters,
  ITagFilters,
  IQueryParams,
  ISortOptions,
  ICMSStats,
  BulkAction,
} from "../types";

// ============================================================================
// Generic Pagination Hook
// ============================================================================

interface IPaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface IUsePaginationReturn {
  pagination: IPaginationState;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  resetPagination: () => void;
}

export function usePagination(initialLimit = 10): IUsePaginationReturn {
  const [pagination, setPagination] = useState<IPaginationState>({
    page: 1,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
  });

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const nextPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      page: Math.min(prev.page + 1, prev.totalPages),
    }));
  }, []);

  const prevPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      page: Math.max(prev.page - 1, 1),
    }));
  }, []);

  const resetPagination = useCallback(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  return {
    pagination,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    resetPagination,
  };
}

// ============================================================================
// Generic Selection Hook
// ============================================================================

interface IUseSelectionReturn<T extends { id: string }> {
  selectedIds: Set<string>;
  selectedItems: T[];
  isSelected: (id: string) => boolean;
  isAllSelected: boolean;
  isSomeSelected: boolean;
  toggle: (id: string) => void;
  toggleAll: () => void;
  select: (ids: string[]) => void;
  deselect: (ids: string[]) => void;
  clear: () => void;
}

export function useSelection<T extends { id: string }>(
  items: T[]
): IUseSelectionReturn<T> {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.has(item.id)),
    [items, selectedIds]
  );

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const isAllSelected = useMemo(
    () => items.length > 0 && items.every((item) => selectedIds.has(item.id)),
    [items, selectedIds]
  );

  const isSomeSelected = useMemo(
    () => selectedIds.size > 0 && !isAllSelected,
    [selectedIds, isAllSelected]
  );

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((item) => item.id)));
    }
  }, [items, isAllSelected]);

  const select = useCallback((ids: string[]) => {
    setSelectedIds((prev) => new Set([...prev, ...ids]));
  }, []);

  const deselect = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return {
    selectedIds,
    selectedItems,
    isSelected,
    isAllSelected,
    isSomeSelected,
    toggle,
    toggleAll,
    select,
    deselect,
    clear,
  };
}

// ============================================================================
// Marketing Content Hook
// ============================================================================

interface IUseContentReturn {
  contents: IMarketingContent[];
  loading: boolean;
  error: string | null;
  pagination: IPaginationState;
  filters: IContentFilters;
  sort: ISortOptions | undefined;
  setFilters: (filters: IContentFilters) => void;
  setSort: (sort: ISortOptions) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  refresh: () => Promise<void>;
  create: (
    data: Partial<IMarketingContent>
  ) => Promise<IMarketingContent | null>;
  update: (
    id: string,
    data: Partial<IMarketingContent>
  ) => Promise<IMarketingContent | null>;
  remove: (id: string) => Promise<boolean>;
  bulkAction: (action: BulkAction, ids: string[]) => Promise<boolean>;
  publish: (id: string) => Promise<boolean>;
  archive: (id: string) => Promise<boolean>;
}

export function useContent(): IUseContentReturn {
  const [contents, setContents] = useState<IMarketingContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<IContentFilters>({});
  const [sort, setSort] = useState<ISortOptions | undefined>();

  const { pagination, setPage, setLimit, resetPagination } = usePagination(10);

  const fetchContents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const params: IQueryParams = {
      page: pagination.page,
      limit: pagination.limit,
      sort,
    };

    try {
      const response = await cmsApi.content.getAll(filters, params);
      if (response.success && response.data) {
        setContents(response.data);
      } else {
        setError(response.error || "Failed to fetch content");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [filters, sort, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const handleSetFilters = useCallback(
    (newFilters: IContentFilters) => {
      setFilters(newFilters);
      resetPagination();
    },
    [resetPagination]
  );

  const handleSetSort = useCallback(
    (newSort: ISortOptions) => {
      setSort(newSort);
      resetPagination();
    },
    [resetPagination]
  );

  const create = useCallback(
    async (data: Partial<IMarketingContent>) => {
      setIsLoading(true);
      try {
        const response = await cmsApi.content.create(data as any);
        if (response.success && response.data) {
          await fetchContents();
          return response.data;
        }
        setError(response.error || "Failed to create content");
        return null;
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchContents]
  );

  const update = useCallback(
    async (id: string, data: Partial<IMarketingContent>) => {
      setIsLoading(true);
      try {
        const response = await cmsApi.content.update(id, data);
        if (response.success && response.data) {
          setContents((prev) =>
            prev.map((c) => (c.id === id ? response.data! : c))
          );
          return response.data;
        }
        setError(response.error || "Failed to update content");
        return null;
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const response = await cmsApi.content.delete(id);
      if (response.success) {
        setContents((prev) => prev.filter((c) => c.id !== id));
        return true;
      }
      setError(response.error || "Failed to delete content");
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const bulkAction = useCallback(
    async (action: BulkAction, ids: string[]) => {
      setIsLoading(true);
      try {
        const response = await cmsApi.content.bulkAction({ action, ids });
        if (response.success) {
          await fetchContents();
          return true;
        }
        setError(response.error || "Failed to perform bulk action");
        return false;
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchContents]
  );

  const publish = useCallback(async (id: string) => {
    try {
      const response = await cmsApi.content.publish(id);
      if (response.success && response.data) {
        setContents((prev) =>
          prev.map((c) => (c.id === id ? response.data! : c))
        );
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const archive = useCallback(async (id: string) => {
    try {
      const response = await cmsApi.content.archive(id);
      if (response.success && response.data) {
        setContents((prev) =>
          prev.map((c) => (c.id === id ? response.data! : c))
        );
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  return {
    contents,
    loading: isLoading,
    error,
    pagination,
    filters,
    sort,
    setFilters: handleSetFilters,
    setSort: handleSetSort,
    setPage,
    setLimit,
    refresh: fetchContents,
    create,
    update,
    remove,
    bulkAction,
    publish,
    archive,
  };
}

// ============================================================================
// Categories Hook
// ============================================================================

interface IUseCategoriesReturn {
  categories: IContentCategory[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (data: Partial<IContentCategory>) => Promise<IContentCategory | null>;
  update: (
    id: string,
    data: Partial<IContentCategory>
  ) => Promise<IContentCategory | null>;
  remove: (id: string) => Promise<boolean>;
}

export function useCategories(
  filters?: ICategoryFilters
): IUseCategoriesReturn {
  const [categories, setCategories] = useState<IContentCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await cmsApi.categories.getAll(filters);
      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        setError(response.error || "Failed to fetch categories");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const create = useCallback(
    async (data: Partial<IContentCategory>) => {
      setIsLoading(true);
      try {
        const response = await cmsApi.categories.create(data as any);
        if (response.success && response.data) {
          await fetchCategories();
          return response.data;
        }
        setError(response.error || "Failed to create category");
        return null;
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchCategories]
  );

  const update = useCallback(
    async (id: string, data: Partial<IContentCategory>) => {
      setIsLoading(true);
      try {
        const response = await cmsApi.categories.update(id, data);
        if (response.success && response.data) {
          setCategories((prev) =>
            prev.map((c) => (c.id === id ? response.data! : c))
          );
          return response.data;
        }
        setError(response.error || "Failed to update category");
        return null;
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const response = await cmsApi.categories.delete(id);
      if (response.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        return true;
      }
      setError(response.error || "Failed to delete category");
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    categories,
    loading: isLoading,
    error,
    refresh: fetchCategories,
    create,
    update,
    remove,
  };
}

// ============================================================================
// Tags Hook
// ============================================================================

interface IUseTagsReturn {
  tags: IContentTag[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (data: Partial<IContentTag>) => Promise<IContentTag | null>;
  update: (
    id: string,
    data: Partial<IContentTag>
  ) => Promise<IContentTag | null>;
  remove: (id: string) => Promise<boolean>;
}

export function useTags(filters?: ITagFilters): IUseTagsReturn {
  const [tags, setTags] = useState<IContentTag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await cmsApi.tags.getAll(filters);
      if (response.success && response.data) {
        setTags(response.data);
      } else {
        setError(response.error || "Failed to fetch tags");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const create = useCallback(
    async (data: Partial<IContentTag>) => {
      setIsLoading(true);
      try {
        const response = await cmsApi.tags.create(data as any);
        if (response.success && response.data) {
          await fetchTags();
          return response.data;
        }
        setError(response.error || "Failed to create tag");
        return null;
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchTags]
  );

  const update = useCallback(async (id: string, data: Partial<IContentTag>) => {
    setIsLoading(true);
    try {
      const response = await cmsApi.tags.update(id, data);
      if (response.success && response.data) {
        setTags((prev) => prev.map((t) => (t.id === id ? response.data! : t)));
        return response.data;
      }
      setError(response.error || "Failed to update tag");
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const response = await cmsApi.tags.delete(id);
      if (response.success) {
        setTags((prev) => prev.filter((t) => t.id !== id));
        return true;
      }
      setError(response.error || "Failed to delete tag");
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    tags,
    loading: isLoading,
    error,
    refresh: fetchTags,
    create,
    update,
    remove,
  };
}

// ============================================================================
// CMS Stats Hook
// ============================================================================

interface IUseStatsReturn {
  stats: ICMSStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useCmsStats(): IUseStatsReturn {
  const [stats, setStats] = useState<ICMSStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await cmsApi.stats.getDashboardStats();
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.error || "Failed to fetch stats");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading: isLoading,
    error,
    refresh: fetchStats,
  };
}



