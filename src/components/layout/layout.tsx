import { useState } from "react";
import { Box, Theme, useMediaQuery } from "@mui/material";
import { Navbar } from "../navbar/navbar";
import { DashboardSidebar } from "../sidbar/sidebar";

interface LayoutProps {
  children: JSX.Element[];
  backgroundImage?: string;
}

export const Layout = ({ children, backgroundImage }: LayoutProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const canFitSolidSidebar = useMediaQuery((theme: Theme) => theme.breakpoints.up("pc"), {
    defaultMatches: true,
    noSsr: false,
  });

  function toggleSidebar() {
    setSidebarOpen(!isSidebarOpen);
  }

  function closeNonSolidSidebar() {
    if (canFitSolidSidebar || !isSidebarOpen) {
      return;
    }

    setSidebarOpen(false);
  }

  return (
    <main className="flex w-screen h-screen">
      <DashboardSidebar onClose={() => setSidebarOpen(false)} open={isSidebarOpen} solid={canFitSolidSidebar} />
      <div className="w-full h-full" style={{ width: "100%", height: "100%", opacity: (isSidebarOpen && !canFitSolidSidebar) ? "0.5" : "1" }} onClick={closeNonSolidSidebar}>
        <div className="flex flex-col h-full" style={{ pointerEvents: (isSidebarOpen && !canFitSolidSidebar) ? 'none' : 'unset'}}>
          <Navbar toggleSidebar={toggleSidebar} />
          <div className="overflow-auto p-3 h-full " style={{ backgroundImage: backgroundImage }}>
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};
