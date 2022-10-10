import { useContext, useRef, useState } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import WalletRoundedIcon from "@mui/icons-material/WalletRounded";
import { AccountPopover } from "./account-popover";
import { AuthContext } from "../contexts/auth-context";

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

export const DashboardNavbar = (props) => {
  const { web3, toggleConnection, address, chainId } = useContext(AuthContext);

  const { onSidebarOpen, ...other } = props;
  const settingsRef = useRef(null);
  const [openAccountPopover, setOpenAccountPopover] = useState(false);

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280,
          },
          width: {
            lg: "calc(100% - 280px)",
          },
        }}
        {...other}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2,
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: "inline-flex",
                lg: "none",
              },
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Tooltip title="Search">
            <IconButton sx={{ ml: 1 }}>
              <SearchIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }} />
          {
            address !== null
              ?          
                <Tooltip title={address} arrow>
                <Typography color="text.secondary" variant="body2">
                  {address.substring(0, 7) +
                    (address.length < 5 ? "" : "...") +
                    address.substring(35, 80)}
                </Typography>
              </Tooltip>
              : <></>
          }
          <Box
            style={{ minWidth: "180px" }}
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            <Button onClick={toggleConnection}>
              {web3 !== null ? "Disconnect Wallet" : "Connect Wallet"}
            </Button>
          </Box>
        </Toolbar>
      </DashboardNavbarRoot>
      <AccountPopover
        anchorEl={settingsRef.current}
        open={openAccountPopover}
        onClose={() => setOpenAccountPopover(false)}
      />
    </>
  );
};

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func,
};
