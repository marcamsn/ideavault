import React, { useState, useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { FiCalendar, FiGrid, FiPlus } from "react-icons/fi";

interface SidebarProps {
  selected: "ideas" | "calendar";
  onSelect: (section: "ideas" | "calendar") => void;
  onAddIdea?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selected, onSelect, onAddIdea }) => {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { signOut } = useAuth();

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
      icon: <FiGrid size={22} />,
      label: "Ideas",
      onClick: () => onSelect("ideas"),
      active: selected === "ideas",
    },
    {
      key: "calendar",
      icon: <FiCalendar size={22} />,
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
      {/* Logo siempre arriba */}
      <div className="flex flex-col items-center justify-start mb-8">
        <img
          src={expanded ? "/logos/Logo.svg" : "/logos/LogoIcon.svg"}
          alt="Logo"
          className={expanded ? "h-8 w-auto mb-2 cursor-pointer" : "h-9 w-9 mb-2 cursor-pointer"}
          onClick={() => setExpanded((prev) => !prev)}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        />
      </div>
      {onAddIdea && (
        <div className="mt-2 mb-4 flex justify-center w-full">
          <button
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-2xl bg-gradient-to-r from-pastel-pink/70 to-pastel-blue/40 shadow-card text-pink-500 font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg ${expanded ? '' : 'justify-center'}`}
            style={{minHeight: 40}}
            onClick={onAddIdea}
          >
            <FiPlus size={20} />
            {expanded && <span>New idea</span>}
          </button>
        </div>
      )}
      <ul className="flex-1">
        {menuItems.map((item) => (
          <li key={item.key} className="mb-2">
            <button
              className={`flex items-center gap-4 px-3 py-2 rounded-2xl w-full transition-all duration-200 text-base font-medium
                ${item.active ? "bg-gradient-to-r from-pastel-pink/60 to-pastel-blue/40 shadow-md text-primary border border-white/40 backdrop-blur-md" : "text-gray-700 hover:bg-white/40 hover:shadow-sm"}
              `}
              style={item.active ? {boxShadow:'0 2px 8px 0 rgba(180,180,255,0.10), 0 1px 0 0 rgba(255,255,255,0.2) inset'} : {}}
              onClick={item.onClick}
            >
              {item.icon}
              {expanded && <span>{item.label}</span>}
            </button>
          </li>
        ))}
      </ul>
      {/* Divider and Sign Out at bottom */}
      <div className="mt-4 mb-2">
        <div className="border-t border-white/30 my-4" />
        <button
          className="flex items-center gap-3 px-3 py-2 rounded-2xl w-full text-base font-medium text-pink-500 hover:bg-pink-100/70 transition-all duration-150"
          onClick={signOut}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
          </svg>
          {expanded && <span>Sign Out</span>}
        </button>
      </div>
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
          <img src="/logos/LogoIcon.svg" alt="Logo" className="h-7 w-7" />
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
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 12L6 6"/></svg>
            </button>
            {/* Botón para añadir nueva idea */}
            <div className="mb-4 flex justify-center">
              <button
                className="flex items-center gap-2 w-full px-3 py-2 rounded-2xl bg-gradient-to-r from-pastel-pink/70 to-pastel-blue/40 shadow-card text-primary font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg justify-center"
                style={{minHeight: 40}}
                onClick={onAddIdea}
              >
                <FiPlus size={20} />
                <span>Nueva idea</span>
              </button>
            </div>
            <ul className="flex-1">
              {menuItems.map((item) => (
                <li key={item.key} className="mb-2">
                  <button
                    className={`flex items-center gap-4 px-3 py-2 rounded-2xl w-full transition-all duration-200 text-base font-medium
                      ${item.active ? "bg-gradient-to-r from-pastel-pink/60 to-pastel-blue/40 shadow-md text-primary border border-white/40 backdrop-blur-md" : "text-gray-700 hover:bg-white/40 hover:shadow-sm"}
                    `}
                    style={item.active ? {boxShadow:'0 2px 8px 0 rgba(180,180,255,0.10), 0 1px 0 0 rgba(255,255,255,0.2) inset'} : {}}
                    onClick={() => {
                      item.onClick();
                      setMobileOpen(false);
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
            {/* Divider and Sign Out at bottom */}
            <div className="mt-4 mb-2">
              <div className="border-t border-white/30 my-4" />
              <button
                className="flex items-center gap-3 px-3 py-2 rounded-2xl w-full text-base font-medium text-pink-500 hover:bg-pink-100/70 transition-all duration-150"
                onClick={() => { signOut(); setMobileOpen(false); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
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
