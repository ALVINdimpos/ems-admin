"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

import { cmsApi } from "../api";
import type {
  IMarketingContent,
  IContentCategory,
  IContentTag,
  IContentFilters,
  ICategoryFilters,
  ITagFilters,
  IQueryParams,
  ISortOptions,
  BulkAction,
  ICmsStats,
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
  setTotal: (total: number) => void;
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

  const setTotal = useCallback((total: number) => {
    setPagination((prev) => ({
      ...prev,
      total,
      totalPages: Math.ceil(total / prev.limit),
    }));
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
    setTotal,
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
  items: T[] = [] as T[]
): IUseSelectionReturn<T> {
  const safeItems = useMemo(() => items ?? [], [items]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const selectedItems = useMemo(
    () => safeItems.filter((item) => selectedIds.has(item.id)),
    [safeItems, selectedIds]
  );

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const isAllSelected = useMemo(
    () =>
      safeItems.length > 0 &&
      safeItems.every((item) => selectedIds.has(item.id)),
    [safeItems, selectedIds]
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
      setSelectedIds(new Set(safeItems.map((item) => item.id)));
    }
  }, [safeItems, isAllSelected]);

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
  isLoading: boolean;
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
  activate: (id: string) => Promise<boolean>;
  archive: (id: string) => Promise<boolean>;
}

export function useContent(): IUseContentReturn {
  const [contents, setContents] = useState<IMarketingContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<IContentFilters>({});
  const [sort, setSort] = useState<ISortOptions | undefined>();

  const { pagination, setPage, setLimit, setTotal, resetPagination } =
    usePagination(10);

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
        setContents(response.data.data ?? []);
        setTotal(response.data.total ?? 0);
      } else {
        setError(response.error || "Failed to fetch content");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [filters, sort, pagination.page, pagination.limit, setTotal]);

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

  const activate = useCallback(async (id: string) => {
    try {
      const response = await cmsApi.content.update(id, { isActive: true });
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
    isLoading: isLoading,
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
    activate,
    archive,
  };
}

// ============================================================================
// Categories Hook
// ============================================================================

interface IUseCategoriesReturn {
  categories: IContentCategory[];
  isLoading: boolean;
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
        // response.data is the array of categories
        const items = Array.isArray(response.data) ? response.data : [];
        setCategories(items);
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
    isLoading: isLoading,
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
  isLoading: boolean;
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
        const items = Array.isArray(response.data) ? response.data : [];
        setTags(items);
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
    isLoading: isLoading,
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
  stats: ICmsStats | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useCmsStats(): IUseStatsReturn {
  const [stats, setStats] = useState<ICmsStats | null>(null);
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
    isLoading,
    error,
    refresh: fetchStats,
  };
}

// ============================================================================
// Announcements Hook (for Landing Page)
// ============================================================================

interface IUseAnnouncementsReturn {
  announcements: IMarketingContent[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAnnouncements(limit = 5): IUseAnnouncementsReturn {
  const [announcements, setAnnouncements] = useState<IMarketingContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await cmsApi.content.getPublished(
        { type: "ANNOUNCEMENT" },
        { limit, sort: { field: "priority", order: "desc" } }
      );

      if (response.success && response.data) {
        setAnnouncements(response.data.data);
      } else {
        setError(response.error || "Failed to fetch announcements");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return {
    announcements,
    isLoading,
    error,
    refresh: fetchAnnouncements,
  };
}

// ============================================================================
// FAQ Hook (for Landing Page)
// ============================================================================

interface IFaqItem {
  id: string;
  question: string;
  answer: string;
  priority: number;
}

interface IUseFaqReturn {
  faqs: IFaqItem[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useFaq(limit = 10): IUseFaqReturn {
  const [faqs, setFaqs] = useState<IFaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFaqs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await cmsApi.content.getPublished(
        { type: "FAQ" },
        { limit, sort: { field: "order", order: "asc" } }
      );

      if (response.success && response.data) {
        // Transform CMS content to FAQ format
        const faqItems: IFaqItem[] = response.data.data.map((content) => ({
          id: content.id,
          question: content.title,
          answer: content.content,
          priority: content.order || 0,
        }));
        setFaqs(faqItems);
      } else {
        setError(response.error || "Failed to fetch FAQs");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  return {
    faqs,
    isLoading,
    error,
    refresh: fetchFaqs,
  };
}
