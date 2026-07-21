export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
      <p className="mt-4 text-sm text-neutral-500">Redirecting you to secure payment…</p>
    </div>
  );
}
