import { useState } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Navbar } from "../navbar/navbar";
import { DashboardSidebar } from "../sidbar/sidebar";

const DashboardLayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  paddingTop: 64,
  [theme.breakpoints.up("pc")]: {
    paddingLeft: 280,
  },
}));

export const Layout = (props: { children: any }) => {
  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <DashboardLayoutRoot>
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
      </DashboardLayoutRoot>
      <Navbar onSidebarOpen={() => setSidebarOpen(true)} />
      <DashboardSidebar onClose={() => setSidebarOpen(false)} open={isSidebarOpen} />
    </>
  );
};
