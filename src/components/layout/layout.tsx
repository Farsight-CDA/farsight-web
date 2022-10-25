import { useState } from "react";
import { Box, Theme, useMediaQuery } from "@mui/material";
import { Navbar } from "../navbar/navbar";
import { DashboardSidebar } from "../sidbar/sidebar";

export const Layout = (props: { children: any }) => {
  const { children } = props;
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
    <main style={{display: "flex", width: "100vw", height: "100vh"}}>
      <DashboardSidebar onClose={() => setSidebarOpen(false)} open={isSidebarOpen} solid={canFitSolidSidebar} />
      <div style={{ width: "100%", height: "100%", opacity: (isSidebarOpen && !canFitSolidSidebar) ? "0.5" : "1" }} onClick={closeNonSolidSidebar}>
        <div style={{ pointerEvents: (isSidebarOpen && !canFitSolidSidebar) ? 'none' : 'unset'}}>
          <Navbar toggleSidebar={toggleSidebar} />
          {children}
        </div>
      </div>
    </main>
  );
};
