import { Metadata } from "next";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Dashboard - EMS",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sticky Sidebar */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 min-w-0 flex-col overflow-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-slate-200">
          <Header />
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 min-w-0 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
