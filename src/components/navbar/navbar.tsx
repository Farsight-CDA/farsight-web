import { useContext, useRef, useState } from "react";
import PropTypes from "prop-types";
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
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { AuthContext } from "../../contexts/auth-context";
import { useRouter } from "next/router";

interface NavbarProps {
  toggleSidebar: () => void;
}

export const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const themeeeee = useTheme();
  const { isConnected, toggleConnection, address, chainId } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [showError, setShowError] = useState(false);

  const router = useRouter();

  const handleKeyDown = (e: any) => {
    if (e.keyCode !== 13 || !validName) {
      return;
    }

    router.replace("/register/" + name);
  };

  const handleInput = (input: string) => {
    input = input.replace(/[^a-zA-Z0-9]/, "").toLowerCase();
    setName(input);
    setShowError(true);

    if (input.length < 4 || input.length > 32) {
      setValidName(false);
    } else {
      setValidName(true);
    }
  };

  return (
    <AppBar position="sticky">
      <Toolbar disableGutters>
        <IconButton
          onClick={toggleSidebar}
          sx={{
            display: {
              mobile: "inline-flex",
              pc: "none",
            },
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>
        <Box sx={{ maxWidth: 500, ml: 2 }}>
          <TextField
            value={name}
            onChange={(x) => handleInput(x.target.value)}
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
          {!validName && showError && name !== "" && (
            <Typography style={{ textAlign: "center", color: "red", marginTop: "8px" }}>
              {name.length < 4 && <>Minimum 4 characters</>}
              {name.length > 32 && <>At most 32 characters</>}
            </Typography>
          )}
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
          <Button
            onClick={toggleConnection}
            style={{ backgroundColor: "{theme.palette.primary.main}" }}
          >
            {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

Navbar.propTypes = {
  onSidebarOpen: PropTypes.func,
};
