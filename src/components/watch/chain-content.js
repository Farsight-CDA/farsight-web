import PropTypes from "prop-types";
import { Button, Card, CardContent, TextField, Tooltip, Typography } from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { useContext, useEffect, useState } from "react";
import { getChainNameByChainId, getLogoNameByChainId } from "../../utils/ChainTranslation";
import { AuthContext } from "../../contexts/auth-context";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import * as React from "react";

export const ChainContent = ({ chainState }) => {
  const { chainId: connectedChainId } = useContext(AuthContext);
  const { chainId, expiration, localOwner, isKeeper, ownerChangeVersion, registrationVersion } =
    chainState;

  const isExpired = expiration <= new Date().getTime() / 1000;
  const basepath = "/static/images/chainlogos/";

  //modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Card
      sx={isExpired ? { backgroundColor: "blue" } : { backgroundColor: "lightgray" }}
      style={chainId === connectedChainId ? { border: "0.2rem solid gray" } : null}
    >
      <CardContent>
        <Grid container spacing={0.5}>
          <Grid xs={3}>
            <img src={basepath + getLogoNameByChainId(chainId)} width="50" height="50" />
          </Grid>
          <Grid xs={9} style={{ display: "flex", justifyContent: "flex-end" }}>
            <Typography color="textPrimary" gutterBottom variant="h5">
              {getChainNameByChainId(chainId)}
            </Typography>
          </Grid>
          {!isExpired && (
            <Grid item xs={12} md={4}>
              <Typography color="textPrimary" gutterBottom variant="h5">
                Keeper Chain: {isKeeper.toString()}
              </Typography>
              <Typography color="textPrimary" gutterBottom variant="h5">
                LocalOwner: {localOwner}
              </Typography>
              <Typography color="textPrimary" gutterBottom variant="h6">
                ExpiresAt: {new Date(Number(expiration * 1000)).toLocaleString()}
              </Typography>
              <Typography color="textPrimary" gutterBottom variant="h6">
                Version: {registrationVersion}.{ownerChangeVersion}
              </Typography>
            </Grid>
          )}

          {isExpired && <h1>LOCKED</h1>}

          <Grid xs={12} />

          {!isExpired && (
            <Grid xs={6} sm={6} md={6} style={{ display: "flex", justifyContent: "flex-start" }}>
              <Tooltip
                title={
                  connectedChainId === null
                    ? "please connect your wallet"
                    : chainId !== connectedChainId
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
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Box maxWidth={"75%"}>
                  <Card style={{ maxWidth: "4" }}>
                    <CardContent>
                      <Grid container spacing={1}>
                        <Grid
                          item
                          xs={12}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography color="textPrimary" gutterBottom variant="h6" mb={4}>
                            Hear you can change your LocalOwner for {getChainNameByChainId(chainId)}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <TextField defaultValue={localOwner} />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Button
                            disabled={chainId !== connectedChainId}
                            variant="contained"
                            onClick={handleOpen}
                          >
                            Confirm
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
              </Modal>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};
