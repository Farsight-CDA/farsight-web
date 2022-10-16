import PropTypes from "prop-types";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import * as React from "react";
import { ChainContent }  from "./chain-content";

export const WatchCard = ({ name, registration }) => {


  return (
    <>
      <Grid container spacing={1}>
        <Grid xs={12}>
          <ChainContent chainState={registration.chain_states[0]} />
        </Grid>
        {
          registration.chain_states.slice(1).map(state => (
            <Grid key={state.chainId} xs={6}>
              <ChainContent chainState={state} />
            </Grid>
           ))
        }
      </Grid>
    </>
  );
};

WatchCard.propTypes = {
  contents: PropTypes.object.isRequired,
};
