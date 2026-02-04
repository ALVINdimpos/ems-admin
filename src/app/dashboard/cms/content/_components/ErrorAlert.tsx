"use client";

interface IErrorAlertProps {
  error: string;
}

export function ErrorAlert({ error }: IErrorAlertProps) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
      <p className="font-medium">Error</p>
      <p className="text-sm mt-1">{error}</p>
    </div>
  );
}
