"use client";

import {
  Users,
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tag,
  ChevronDown,
  ChevronRight,
  Settings,
  Home,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import logo from "../../../../public/logo.png";

// Navigation items configuration
interface INavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: INavItem[];
}

const navigationItems: INavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-4 w-4" />,
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: <Users className="h-4 w-4" />,
  },
  {
    label: "CMS",
    href: "/dashboard/cms",
    icon: <Settings className="h-4 w-4" />,
    children: [
      {
        label: "Overview",
        href: "/dashboard/cms",
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
      {
        label: "Content",
        href: "/dashboard/cms/content",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        label: "Categories",
        href: "/dashboard/cms/categories",
        icon: <FolderOpen className="h-4 w-4" />,
      },
      {
        label: "Tags",
        href: "/dashboard/cms/tags",
        icon: <Tag className="h-4 w-4" />,
      },
    ],
  },
];

// NavItem component for rendering navigation items
function NavItemComponent({
  item,
  isActive,
  isExpanded,
  onToggle,
  level = 0,
}: {
  item: INavItem;
  isActive: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  level?: number;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const pathname = usePathname();

  // Check if any child is active
  const isChildActive = hasChildren
    ? item.children!.some((child) => pathname === child.href)
    : false;

  const baseClasses =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition";
  const activeClasses = "bg-[#0f6ca6] shadow-sm";
  const inactiveClasses = "hover:bg-white/10";
  const childActiveClasses = "bg-white/5";

  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          onClick={onToggle}
          className={`${baseClasses} ${
            isChildActive ? childActiveClasses : inactiveClasses
          }`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10">
            {item.icon}
          </span>
          <span className="flex-1 text-left">{item.label}</span>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        {isExpanded && (
          <div className="ml-4 mt-1 space-y-1 border-l border-white/20 pl-4">
            {item.children!.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={`${baseClasses} py-2 ${
                  pathname === child.href ? activeClasses : inactiveClasses
                }`}
              >
                <span className="flex h-6 w-6 items-center justify-center">
                  {child.icon}
                </span>
                <span>{child.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10">
        {item.icon}
      </span>
      <span>{item.label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    // Auto-expand CMS if we're on a CMS route
    CMS: pathname.startsWith("/dashboard/cms"),
  });

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside className="flex h-screen w-64 flex-col bg-[#0b4f7a] text-white shadow-xl">
      {/* Brand block matching reference */}
      <div className="px-8 pt-10 text-center">
        <div className="mb-10 flex justify-center">
          <Image
            src={logo}
            alt="QT Global Software logo"
            width={220}
            height={80}
            className="h-16 w-auto"
            priority
          />
        </div>
        <p className="text-sm font-semibold tracking-wide">
          Event Management System
        </p>
        <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 space-y-1 overflow-y-auto px-3">
        {navigationItems.map((item) => (
          <NavItemComponent
            key={item.href}
            item={item}
            isActive={pathname === item.href}
            isExpanded={expandedItems[item.label]}
            onToggle={() => toggleExpanded(item.label)}
          />
        ))}
      </nav>

      {/* Footer hint */}
      <div className="border-t border-white/10 px-6 py-4 text-[11px] text-white/60">
        Admin Management Panel
      </div>
    </aside>
  );
}

