export default function DashboardLoading() {
  return (
    <div className="p-6">
      <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse mb-4" />
      <div className="h-4 w-96 bg-neutral-100 rounded animate-pulse mb-6" />
      <div className="flex gap-4">
        <div className="h-24 w-40 bg-neutral-100 rounded animate-pulse" />
        <div className="h-24 w-40 bg-neutral-100 rounded animate-pulse" />
        <div className="h-24 w-40 bg-neutral-100 rounded animate-pulse" />
      </div>
    </div>
  );
}
