"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p className="mb-4">{error.message}</p>

        <div className="flex gap-2">
          <button
            onClick={() => reset()}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Retry
          </button>

          <a
            href="/onboarding"
            className="bg-red-700 text-white px-4 py-2 rounded"
          >
            Start Over
          </a>
        </div>
      </div>
    </div>
  );
}