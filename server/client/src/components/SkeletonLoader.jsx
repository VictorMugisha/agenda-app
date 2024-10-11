export default function SkeletonLoader() {
  return (
    <div className="bg-gray-100 rounded-lg shadow-sm p-4 animate-pulse">
      <div className="flex justify-between items-start mb-2">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
      </div>
      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  );
}
