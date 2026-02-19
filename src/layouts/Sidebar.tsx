import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-slate-800 border-r border-slate-700 p-4">
      <h1 className="text-xl font-bold mb-6">PortfolioAI</h1>

      <nav className="flex flex-col gap-3">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `px-3 py-2 rounded ${
              isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-700"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink to="/portfolio" className="px-3 py-2 rounded text-slate-300 hover:bg-slate-700">
          Portfolio
        </NavLink>

        <NavLink to="/ai-insights" className="px-3 py-2 rounded text-slate-300 hover:bg-slate-700">
          AI Insights
        </NavLink>

        <NavLink to="/transactions" className="px-3 py-2 rounded text-slate-300 hover:bg-slate-700">
          Transactions
        </NavLink>

        <NavLink to="/settings" className="px-3 py-2 rounded text-slate-300 hover:bg-slate-700">
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
