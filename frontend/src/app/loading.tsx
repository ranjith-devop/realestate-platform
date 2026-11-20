export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
      {/* Hero skeleton */}
      <div className="h-10 w-64 bg-gray-200 rounded-xl" />
      <div className="h-4 w-48 bg-gray-100 rounded" />

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="rounded-2xl bg-gray-200 h-72" />
        ))}
      </div>
    </div>
  );
}
