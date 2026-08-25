import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <h1 className="text-6xl font-extrabold text-muted-foreground">404</h1>
      <h2 className="text-2xl font-bold">Analysis or Page Not Found</h2>
      <p className="text-muted-foreground max-w-md">
        The page you are looking for does not exist, or you do not have permission to view it.
      </p>
      <Link
        href="/dashboard"
        className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 text-sm transition-all"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
