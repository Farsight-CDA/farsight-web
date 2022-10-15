import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/auth-context";
import { mainChainId, isSupported } from "../../utils/chain-ids";
import { RegisterStatusCard } from "./register-status-card";

export const RegisterCard = ({ product, name }) => {
  const { isConnected, chainId } = useContext(AuthContext);
  const isSupportedChain = isSupported(chainId);

  const [year, setYear] = useState(1);

  const activeStep = !isConnected || !isSupportedChain ? 0
                                                       : 1;

  return (
    <>
      <Grid container spacing={1}>
        <Grid xs={12}>
          <Card>
            <CardContent>
              <Grid container direction={"row"}>
                <Grid xs={6}>
                  <Typography align="left" color="textPrimary" gutterBottom variant="h5">
                    {name}.far
                  </Typography>
                </Grid>
                <Grid xs={6} style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                  >
                    BUY
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12}>
          <Card>
            <CardContent>
              <Grid container>
                {/* Registration Period */}
                <Grid xs={12} sm={5} md={3} item>
                  <Typography color="textPrimary" gutterBottom variant="h7">
                    Registration Period
                  </Typography>
                  <Divider />
                  <Grid container direction={"row"}>
                    <Grid item xs={2} sm={2} md={2}>
                      <IconButton
                        onClick={() => (year < 2 ? null : setYear(year - 1))}
                        aria-label="delete"
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={8} sm={8} md={8}>
                      <Typography
                        align="center"
                        color="textPrimary"
                        gutterBottom
                        variant="h5"
                        minWidth={"11rem"}
                      >
                        {year > 1 ? year + " Years" : year + " Year"}
                      </Typography>
                    </Grid>
                    <Grid item xs={2} sm={2} md={2}>
                      <IconButton onClick={() => setYear(year + 1)} aria-label="delete">
                        <AddIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
                {/* Arrow */}
                <Grid
                  xs={2}
                  sm={2}
                  md={1}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <KeyboardDoubleArrowRightIcon fontSize={"large"} />
                </Grid>
                {/* Registration price to pay */}
                <Grid item xs={12} sm={5} md={3}>
                  <Typography color="textPrimary" gutterBottom variant="h7">
                    Registration price to pay
                  </Typography>
                  <Divider />
                  <Typography color="textPrimary" gutterBottom variant="h5" mt={"0.2rem"}>
                    {product.REGISTRATIONPRICE}
                  </Typography>
                </Grid>
                {/* Arrow */}
                <Grid
                  xs={12}
                  sm={12}
                  md={1}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <KeyboardDoubleArrowRightIcon fontSize={"large"} />
                </Grid>
                {/* Total Price */}
                <Grid item xs={12} sm={12} md={4}>
                  <Typography color="textPrimary" gutterBottom variant="h7">
                    The price depending on the chain.
                  </Typography>
                  <Divider />
                  <Typography color="textPrimary" gutterBottom variant="h6" mt={"0.2rem"}>
                    {product.REGISTRATIONPRICE +
                      "." +
                      product.PARENT +
                      " + " +
                      product.GASFEE +
                      "." +
                      product.PARENT +
                      " = " +
                      (product.GASFEE + product.REGISTRATIONPRICE) +
                      "." +
                      product.PARENT}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12}>
          <Card>
            <CardContent>
              <Typography color="textPrimary" gutterBottom variant="h7">
                * Favorite the name for easy access in case you close out of your browser.
              </Typography>
              <Divider />
              <Typography color="textPrimary" gutterBottom variant="h5">
                Registering a name requires you to complete 4 steps
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12}>
          <Card>
            <Box sx={{ maxWidth: 400 }}>
              <RegisterStatusCard></RegisterStatusCard>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

RegisterCard.propTypes = {
  product: PropTypes.object.isRequired,
};
