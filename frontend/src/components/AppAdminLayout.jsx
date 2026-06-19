import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo-monora.png";
import {
  IoGridOutline,
  IoPeopleOutline,
  IoCalendarOutline,
  IoReceiptOutline,
  IoBarChartOutline,
  IoLogOutOutline,
  IoArrowBack,
  IoPersonOutline,
  IoShieldCheckmarkOutline,
  IoPricetagsOutline,
  IoPricetagOutline,
  IoFlashOutline,
  IoArrowUndoOutline,
  IoChatbubblesOutline,
  IoMenuOutline,
  IoCloseOutline,
} from "react-icons/io5";

const sidebarLinks = [
  { to: "/app-admin/dashboard", icon: IoGridOutline, label: "Dashboard" },
  { to: "/app-admin/users", icon: IoPeopleOutline, label: "Users" },
  {
    to: "/app-admin/categories",
    icon: IoPricetagsOutline,
    label: "Categories",
  },
  { to: "/app-admin/events", icon: IoCalendarOutline, label: "All Events" },
  { to: "/app-admin/orders", icon: IoReceiptOutline, label: "All Orders" },
  { to: "/app-admin/vouchers", icon: IoPricetagOutline, label: "Vouchers" },
  { to: "/app-admin/promos", icon: IoFlashOutline, label: "Promos" },
  { to: "/app-admin/refunds", icon: IoArrowUndoOutline, label: "Refunds" },
  { to: "/app-admin/chats", icon: IoChatbubblesOutline, label: "Chats" },
  { to: "/app-admin/analytics", icon: IoBarChartOutline, label: "Analytics" },
];

function AppAdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0B0D1A] flex">
      {/* Mobile Header */}
      <div
        className="fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-4 z-50 lg:hidden"
        style={{
          background: "rgba(11,13,26,0.95)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)" }}
          >
            <IoShieldCheckmarkOutline className="text-base" />
          </div>
          <span
            className="text-white font-bold text-base"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
            }}
          >
            Monora
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-white bg-transparent border-none cursor-pointer"
        >
          {sidebarOpen ? (
            <IoCloseOutline className="text-xl" />
          ) : (
            <IoMenuOutline className="text-xl" />
          )}
        </button>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 shrink-0 fixed top-0 left-0 h-full flex flex-col z-50 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        style={{
          background:
            "linear-gradient(180deg, rgba(15,17,35,0.98) 0%, rgba(10,12,28,0.99) 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <div
          className="px-5 py-5 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-1.5 flex-1">
            <img src={logo} alt="Monora Logo" className="w-16 -mr-2" />
            <span
              className="text-white font-bold text-lg"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
              }}
            >
              Monora
            </span>
            <span className="text-[9px] font-bold ml-2 px-1.5 py-0.5 rounded-md bg-orange-500/15 text-orange-400 tracking-wider">
              ADMIN
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white bg-transparent border-none cursor-pointer lg:hidden ml-2"
          >
            <IoCloseOutline className="text-lg" />
          </button>
        </div>

        {/* User Info */}
        <div
          className="px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 shrink-0">
              <IoPersonOutline className="text-white text-sm" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-white text-sm font-medium truncate">
                {user?.name}
              </div>
              <div className="text-purple-300/50 text-[11px]">
                App Administrator
              </div>
            </div>
          </div>
        </div>

        {/* Nav Links - no scrollbar */}
        <nav
          className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`.appadmin-nav::-webkit-scrollbar { display: none; }`}</style>
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/app-admin/dashboard"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium no-underline transition-all ${isActive
                  ? "text-purple-400 bg-purple-500/10"
                  : "text-white/40 hover:text-white/80 hover:bg-white/5"
                }`
              }
            >
              <link.icon className="text-lg shrink-0" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div
          className="px-3 pb-5 pt-3 space-y-0.5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={() => {
              navigate("/");
              setSidebarOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white/80 hover:bg-white/5 transition-all w-full bg-transparent border-none cursor-pointer"
          >
            <IoArrowBack className="text-lg" />
            Back to Site
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all w-full bg-transparent border-none cursor-pointer"
          >
            <IoLogOutOutline className="text-lg" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 lg:ml-64 pt-14 lg:pt-0">{children}</main>
    </div>
  );
}

export default AppAdminLayout;
