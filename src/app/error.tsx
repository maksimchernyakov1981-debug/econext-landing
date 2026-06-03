"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-xl font-bold text-red-700">Ошибка загрузки</h1>
      <p className="mt-2 text-sm text-gray-600 max-w-md">
        {error.message || "Internal Server Error"}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 px-6 py-3 bg-green-700 text-white rounded-xl"
      >
        Попробовать снова
      </button>
    </div>
  );
}
