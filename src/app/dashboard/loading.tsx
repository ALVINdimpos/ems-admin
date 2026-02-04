import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
