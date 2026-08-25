import Sidebar from "@/components/Sidebar";

export default function AppShell({ children }) {
  return (
    <div className="page-wrap py-8 lg:py-10">
      <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
        <Sidebar />
        <div className="flex-1 min-w-0 space-y-8">{children}</div>
      </div>
    </div>
  );
}
