import React, { useState, useEffect } from "react";
import { FaLightbulb, FaCalendarAlt, FaBars, FaTimes } from "react-icons/fa";

interface SidebarProps {
  selected: "ideas" | "calendar";
  onSelect: (section: "ideas" | "calendar") => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selected, onSelect }) => {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  // Responsive breakpoints
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const menuItems = [
    {
      key: "ideas",
      icon: <FaLightbulb size={22} />,
      label: "Ideas",
      onClick: () => onSelect("ideas"),
      active: selected === "ideas",
    },
    {
      key: "calendar",
      icon: <FaCalendarAlt size={22} />,
      label: "Calendar",
      onClick: () => onSelect("calendar"),
      active: selected === "calendar",
    },
  ];

  // Sidebar width
  const sidebarWidth = expanded ? "w-56" : "w-16";
  const mobileSidebarWidth = "w-4/5 max-w-xs";

  // Sidebar content
  const sidebarContent = (
    <nav className={`h-full flex flex-col bg-white/80 backdrop-blur-lg shadow-card transition-all duration-200 ${sidebarWidth} py-6 px-2`}> 
      <button
        className="mb-8 flex items-center justify-center text-gray-700 hover:text-primary focus:outline-none"
        onClick={() => setExpanded((prev) => !prev)}
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {expanded ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>
      <ul className="flex-1">
        {menuItems.map((item) => (
          <li key={item.key} className="mb-4">
            <button
              className={`flex items-center gap-4 px-3 py-2 rounded-lg w-full transition-colors duration-150 ${item.active ? "bg-primary/20 text-primary" : "text-gray-700 hover:bg-gray-200"}`}
              onClick={item.onClick}
            >
              {item.icon}
              {expanded && <span className="font-medium text-base">{item.label}</span>}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  // Mobile overlay
  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          className="bg-white/90 rounded-full p-2 shadow-card"
          onClick={() => setMobileOpen(true)}
          aria-label="Open sidebar menu"
        >
          <FaBars size={22} />
        </button>
      </div>
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className={`bg-white/90 backdrop-blur-lg shadow-card h-full ${mobileSidebarWidth} p-6 flex flex-col animate-slide-in-left`}
          >
            <button
              className="mb-8 flex items-center justify-end text-gray-700 hover:text-primary focus:outline-none"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar menu"
            >
              <FaTimes size={22} />
            </button>
            <ul className="flex-1">
              {menuItems.map((item) => (
                <li key={item.key} className="mb-4">
                  <button
                    className={`flex items-center gap-4 px-3 py-2 rounded-lg w-full transition-colors duration-150 ${item.active ? "bg-primary/20 text-primary" : "text-gray-700 hover:bg-gray-200"}`}
                    onClick={() => {
                      item.onClick();
                      setMobileOpen(false);
                    }}
                  >
                    {item.icon}
                    <span className="font-medium text-base">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Overlay to close */}
          <div className="flex-1 bg-black/30" onClick={() => setMobileOpen(false)} />
        </div>
      )}
      {/* Desktop/Tablet sidebar */}
      <aside className={`hidden md:block fixed top-0 left-0 h-full z-30 transition-all duration-200 ${sidebarWidth}`}>{sidebarContent}</aside>
    </>
  );
};

export default Sidebar;
