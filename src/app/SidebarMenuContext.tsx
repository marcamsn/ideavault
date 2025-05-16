import React, { createContext, useContext, useState } from "react";

type Section = "ideas" | "calendar" | "dashboard";

interface SidebarMenuContextProps {
  section: Section;
  setSection: (section: Section) => void;
}

const SidebarMenuContext = createContext<SidebarMenuContextProps | undefined>(undefined);

export const SidebarMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [section, setSection] = useState<Section>("ideas");
  return (
    <SidebarMenuContext.Provider value={{ section, setSection }}>
      {children}
    </SidebarMenuContext.Provider>
  );
};

export const useSidebarMenu = () => {
  const context = useContext(SidebarMenuContext);
  if (!context) {
    throw new Error("useSidebarMenu must be used within a SidebarMenuProvider");
  }
  return context;
};
