import PropTypes from "prop-types";
import { Box, Button, MenuItem, MenuList, Popover, Typography } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth-context";

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const { provider, toggleConnection, address, chainId, isConnected } = useContext(AuthContext);

  async function WalletConection() {
    const validChainID = [1, 56, 137, 43114, 250, 1284, 1313161554];
    return validChainID.includes(chainId);
  }

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: { width: "auto", minWidth: "200px" },
      }}
      {...other}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        <Typography variant="body2">aaaaaa</Typography>
        <Typography color="text.secondary" variant="body2">
          bbbbb
        </Typography>
      </Box>
      <Box
        sx={{
          py: 1.5,
          px: 2,
        }}
      ></Box>
      <Button onClick={toggleConnection}>
        {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
      </Button>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};
