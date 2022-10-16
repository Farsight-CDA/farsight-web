import PropTypes from "prop-types";
import { Button, Card, CardContent, TextField, Tooltip, Typography } from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { useContext, useEffect, useState } from "react";
import { chainIdToName, chainIdToSvg } from "../../utils/ChainTranslation";
import { AuthContext } from "../../contexts/auth-context";
import BasicModal from "../modal/modal";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import * as React from "react";

const ChainContent = ({ params }) => {
  const [expired, setExpired] = useState(true);
  const { chainId } = useContext(AuthContext);
  const basepath = "/static/images/chainlogos/";

  //modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (params.content[0].expiration > new Date().getTime()) {
      setExpired(false);
    }
  }, [params]);

  return (
    <Card style={chainId === params.content[0].chainId ? { border: "0.2rem solid red" } : null}>
      <CardContent>
        <Grid container spacing={0.5}>
          <Grid xs={3}>
            <img src={basepath + chainIdToSvg[params.content[0].chainId]} width="50" height="50" />
          </Grid>
          <Grid xs={9} style={{ display: "flex", justifyContent: "flex-end" }}>
            <Typography color="textPrimary" gutterBottom variant="h6">
              {chainIdToName[params.content[0].chainId]}
            </Typography>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <Typography color="textPrimary" gutterBottom variant="h5">
              {params.content[0].owner}
            </Typography>
          </Grid>
          <Grid xs={12} />

          <Grid xs={6} sm={6} md={6} style={{ display: "flex", justifyContent: "flex-start" }}>
            <Tooltip
              followCursor
              title={
                chainId == null
                  ? "please connect your wallet"
                  : chainId !== params.content[0].chainId
                  ? "you are connected to another chain"
                  : "here you can edit your chain address"
              }
            >
              <span>
                <Button
                  disabled={chainId !== params.content[0].chainId}
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
            <Tooltip title={new Date(params.content[0].expiration).toString()}>
              <span>
                <Button disabled={expired} variant="contained">
                  {expired ? "Expired" : "Open"}
                </Button>
              </span>
            </Tooltip>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export const WatchCard = ({ contents }, { name }) => {
  return (
    <>
      <Grid container spacing={1}>
        <Grid xs={12}>
          <ChainContent params={contents[0]} />
        </Grid>
        {contents.slice(1).map((content) => (
          <Grid key={content.chainId + name} xs={6}>
            <ChainContent params={content} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

WatchCard.propTypes = {
  contents: PropTypes.object.isRequired,
};
