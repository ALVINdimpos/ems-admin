"use client";

export function ContentTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-4 py-4">
            <div className="h-4 w-4 bg-gray-200 rounded" />
          </td>
          <td className="px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
          </td>
          <td className="px-4 py-4">
            <div className="h-5 w-16 bg-gray-200 rounded-full" />
          </td>
          <td className="px-4 py-4">
            <div className="h-5 w-16 bg-gray-200 rounded-full" />
          </td>
          <td className="px-4 py-4">
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </td>
          <td className="px-4 py-4">
            <div className="h-5 w-12 bg-gray-200 rounded-full" />
          </td>
          <td className="px-4 py-4">
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </td>
          <td className="px-4 py-4">
            <div className="h-8 w-8 bg-gray-200 rounded ml-auto" />
          </td>
        </tr>
      ))}
    </>
  );
}
