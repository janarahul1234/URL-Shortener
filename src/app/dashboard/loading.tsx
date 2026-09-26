export default function DashboardLoading() {
  return (
    <main className="py-24" aria-busy="true">
      <p className="text-sm text-ink">
        LOADING CONTROL PANEL
        <span className="cursor-blink" aria-hidden="true">
          ...▌
        </span>
      </p>
    </main>
  );
}
