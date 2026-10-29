
import { Outlet } from "react-router-dom";
import DashboardLeftSide from "../components/DashBoardLeftSide";

function Dashboard() {
  return (
    <section className="min-h-[calc(100vh-80px)] bg-[#f8faf8] px-3 py-5 sm:px-5 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-start gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:sticky lg:top-5">
          <DashboardLeftSide />
        </aside>

        <main className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <Outlet />
        </main>
      </div>
    </section>
  );
}

export default Dashboard;
