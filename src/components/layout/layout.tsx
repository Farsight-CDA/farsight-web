import { useState } from "react";
import { Box } from "@mui/material";
import { Navbar } from "../navbar/navbar";
import { DashboardSidebar } from "../sidbar/sidebar";

export const Layout = (props: { children: any }) => {
  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar onSidebarOpen={() => setSidebarOpen(true)} />
      <Box
        sx={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {children}
      </Box>
      <DashboardSidebar onClose={() => setSidebarOpen(false)} open={isSidebarOpen} />
    </>
  );
};
