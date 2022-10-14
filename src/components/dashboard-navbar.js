import { useContext, useRef, useState } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  SvgIcon,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { AccountPopover } from "./account-popover";
import { AuthContext } from "../contexts/auth-context";
import { useRouter } from "next/router";

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

export const DashboardNavbar = (props) => {
  const { isConnected, toggleConnection, address, chainId } = useContext(AuthContext);

  const { onSidebarOpen, ...other } = props;
  const settingsRef = useRef(null);
  const [openAccountPopover, setOpenAccountPopover] = useState(false);

  const [name, setName] = useState("");

  const router = useRouter();

  const handleKeyDown = (e) => {
    if (e.keyCode !== 13) {
      return;
    }

    router.push("register/" + name);
  };

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
          <Box sx={{ maxWidth: 500, ml: 2 }}>
            <TextField
              value={name}
              onChange={(x) => setName(x.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SvgIcon fontSize="small" color="action">
                      <SearchIcon />
                    </SvgIcon>
                  </InputAdornment>
                ),
              }}
              placeholder="Search on-chain name"
              variant="standard"
            />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {address !== null ? (
            <Tooltip title={address} arrow>
              <Typography color="text.secondary" variant="body2">
                {address.substring(0, 7) +
                  (address.length < 5 ? "" : "...") +
                  address.substring(35, 80)}
              </Typography>
            </Tooltip>
          ) : (
            <></>
          )}
          <Box
            style={{ minWidth: "180px" }}
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            <p>{isConnected}</p>
            <Button onClick={toggleConnection}>
              {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
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
