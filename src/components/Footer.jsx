import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} ScamShield. All rights reserved.
        </p>
        <p className="text-sm font-medium text-muted-foreground">
          Built by <span className="text-foreground font-semibold">Ayush Ranjan</span>
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link
            href="https://github.com/Ayush4242/scamshield"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </Link>
          <Link
            href="[PLACEHOLDER_LINKEDIN_URL]"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}
