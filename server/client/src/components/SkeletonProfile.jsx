export default function SkeletonProfile() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start">
          <div className="w-32 h-32 bg-gray-300 rounded-full mb-4 sm:mb-0 sm:mr-8"></div>
          <div className="text-center sm:text-left flex-grow w-full">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
              <div className="h-10 bg-gray-300 rounded-full w-32"></div>
              <div className="h-10 bg-gray-300 rounded-full w-32"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
