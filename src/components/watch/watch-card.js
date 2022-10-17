import PropTypes from "prop-types";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import {
  Box,
  Card
} from "@mui/material";
import * as React from "react";
import { ChainContent } from "./chain-content";
import { Typography } from "@mui/material";

export const WatchCard = ({ name, registration }) => {
  return (
    <>
      <Typography sx={{ mb: 3, ml: 1 }} variant="h4">
        {name}.far
      </Typography>
      <Grid container spacing={1}>
        <Card sx={{ width: "100%", margin: "40px", backgroundColor: "#D2D3D4" }}>
          <Grid xs={12} >
            <Typography sx={{ mb: 3, ml: 1, textAlign: "center", padding: "25px", borderBottom: "3px solid black", margin: "0" }} variant="h5">
              NFT Chain
            </Typography>
            <ChainContent
              chainStates={registration.chainStates}
              chainState={registration.chainStates.filter(x => x.isKeeper)[0]}
            />
          </Grid>
        </Card>
        <Card sx={{ width: "100%", margin: "40px", backgroundColor: "#D2D3D4" }}>
          <Typography sx={{ mb: 3, ml: 1, textAlign: "center", padding: "25px", borderBottom: "3px solid black", margin: "0" }} variant="h5">
            Other Supported Chains
          </Typography>
          {registration.chainStates.filter(x => !x.isKeeper).map((state) => (
            <Grid key={state.chainId} xs={6}>
              <ChainContent chainStates={registration.chainStates} chainState={state} />
            </Grid>
          ))}
        </Card>
      </Grid>
    </>
  );
};
