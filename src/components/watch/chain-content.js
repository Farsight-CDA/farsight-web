import PropTypes from "prop-types";
import {
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { useContext, useState } from "react";
import { getChainNameByChainId, getLogoNameByChainId } from "../../utils/ChainTranslation";
import { AuthContext } from "../../contexts/auth-context";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { NoKeeperChainHint } from "./no-keeper-chain";
import LockIcon from "@mui/icons-material/Lock";

export const ChainContent = ({ chainState, chainStates }) => {
  const { chainId: connectedChainId } = useContext(AuthContext);

  if (chainState === undefined) {
    return (<NoKeeperChainHint></NoKeeperChainHint>);
  } 

  const { chainId, expiration, localOwner, isKeeper, ownerChangeVersion, registrationVersion } =
    chainState;

  const isExpired = expiration <= new Date().getTime() / 1000;
  const basepath = "/static/images/chainlogos/";

  //modal
  const [open1, setOpen1] = useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);
  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);
  const changeLocalOwner = () => {}; //ToDo: machmal
  const changeToMainChain = () => {}; //ToDo: machmal

  return (
    <Card
      sx={isExpired ? { backgroundColor: "gray" } : { backgroundColor: "lightgray" }}
      style={chainId === connectedChainId ? { border: "0.2rem solid gray" } : null}
    >
      <CardContent>
        <Grid container spacing={0.5}>
          <Grid xs={3} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <img src={basepath + getLogoNameByChainId(chainId)} width="50" height="50" />
          </Grid>
          <Grid xs={9} style={{ display: "flex", justifyContent: "flex-end" }}>
            <Typography color="textPrimary" gutterBottom variant="h5">
              {getChainNameByChainId(chainId)}
            </Typography>
          </Grid>
          <Grid xs={12} />
          {!isExpired && (
            <Grid item xs={12}>
              <Box>
                <Typography color="textPrimary" gutterBottom variant="h5">
                  LocalOwner:  {localOwner.slice(0, 7) + "..." + localOwner.slice(21, 28)}
                </Typography>
              </Box>
              <Typography color="textPrimary" gutterBottom variant="h6">
                ExpiresAt: {new Date(Number(expiration * 1000)).toLocaleString()}
              </Typography>
              <Typography color="textPrimary" gutterBottom variant="h6">
                Version: {registrationVersion}.{ownerChangeVersion}
              </Typography>
            </Grid>
          )}
          {isExpired && <LockIcon fontSize={"large"} sx={{ ml: 1 }} />}
          {!isExpired && (
            <>
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
                      onClick={setOpen2}
                    >
                      Send NFT to
                    </Button>
                  </span>
                </Tooltip>
                <Modal
                  open={open2}
                  onClose={handleClose2}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Box maxWidth={"75%"}>
                    <Card style={{ maxWidth: "4" }}>
                      <CardContent>
                        <Typography color="textPrimary" gutterBottom variant="h6" mb={4}>
                          Hear you can Change to an other Chain
                        </Typography>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          defaultValue="female"
                          name="radio-buttons-group"
                        >
                          {chainStates.map((state) => (
                            <FormControlLabel
                              key={state.chainId}
                              value={state.chainId}
                              control={<Radio />}
                              label={getChainNameByChainId(state.chainId)}
                            />
                          ))}
                        </RadioGroup>
                        <span>
                          <Button
                            sx={{ mt: 2 }}
                            disabled={chainId !== connectedChainId}
                            variant="contained"
                            onClick={changeToMainChain && handleClose2}
                          >
                            Confirm
                          </Button>
                        </span>
                      </CardContent>
                    </Card>
                  </Box>
                </Modal>
              </Grid>
              <Grid xs={6} sm={6} md={6} style={{ display: "flex", justifyContent: "flex-end" }}>
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
                      onClick={handleOpen1}
                    >
                      edit
                    </Button>
                  </span>
                </Tooltip>
                <Modal
                  open={open1}
                  onClose={handleClose1}
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
                              Hear you can change your LocalOwner for{" "}
                              {getChainNameByChainId(chainId)}
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
                            <span>
                              <Button
                                disabled={chainId !== connectedChainId}
                                variant="contained"
                                onClick={changeLocalOwner && handleClose1}
                              >
                                Confirm
                              </Button>
                            </span>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Box>
                </Modal>
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};
