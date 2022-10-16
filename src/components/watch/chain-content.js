import PropTypes from "prop-types";
import { Button, Card, CardContent, TextField, Tooltip, Typography } from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { useContext, useEffect, useState } from "react";
import { getChainNameByChainId, getLogoNameByChainId } from "../../utils/ChainTranslation";
import { AuthContext } from "../../contexts/auth-context";
import BasicModal from "../modal/modal";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import * as React from "react";

export const ChainContent = ({ chainState }) => {
  const { chainId: connectedChainId } = useContext(AuthContext);

  console.log(chainState);

  //const { chain_id, expiration, localOwner, registrationVersion, ownerChangeVersion } = chainState;


  const isExpired = expiration <= new Date().getTime() / 1000;
  const basepath = "/static/images/chainlogos/";

  //modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Card style={chainId === connectedChainId ? { border: "0.2rem solid red" } : null}>
      <CardContent>
        <Grid container spacing={0.5}>

          <Grid xs={3}>
            <img src={basepath + getLogoNameByChainId(chainId)} width="50" height="50" />
          </Grid>
          <Grid xs={9} style={{ display: "flex", justifyContent: "flex-end" }}>
            <Typography color="textPrimary" gutterBottom variant="h6">
              {getChainNameByChainId(chainId)}
            </Typography>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <Typography color="textPrimary" gutterBottom variant="h5">
              LocalOwner: {localOwner}
            </Typography>
          </Grid>
          <Grid xs={12} />

          <Grid xs={6} sm={6} md={6} style={{ display: "flex", justifyContent: "flex-start" }}>
            <Tooltip
              followCursor
              title={
                connectedChainId === null
                  ? "please connect your wallet"
                  : chainId != connectedChainId
                    ? "you are connected to another chain"
                    : "here you can edit your chain address"
              }
            >
              <span>
                <Button
                  disabled={chainId !== connectedChainId}
                  variant="contained"
                  onClick={handleOpen}
                >
                  edit
                </Button>
              </span>
            </Tooltip>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box></Box>
            </Modal>
          </Grid>
          <Grid xs={6} sm={6} md={6} style={{ display: "flex", justifyContent: "flex-end" }}>
            <Tooltip title={new Date(expiration).toString()}>
              <span>
                <Button disabled={isExpired} variant="contained">
                  {isExpired ? "Expired" : "Open"}
                </Button>
              </span>
            </Tooltip>
          </Grid>

        </Grid>
      </CardContent>
    </Card>
  );
};
