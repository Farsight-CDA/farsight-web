import PropTypes from "prop-types";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import * as React from "react";
import { ChainContent } from "./chain-content";
import { Typography } from "@mui/material";

export const WatchCard = ({ name, registration }) => {
  return (
    <>
      <Typography sx={{ mb: 3, ml: 1 }} variant="h4">
        Watch all Registrations
      </Typography>
      <Grid container spacing={1}>
        <Grid xs={12}>
          <ChainContent
            chainStates={registration.chainStates}
            chainState={registration.chainStates[0]}
          />
        </Grid>
        {registration.chainStates.slice(1).map((state) => (
          <Grid key={state.chainId} xs={6}>
            <ChainContent chainStates={registration.chainStates} chainState={state} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};
