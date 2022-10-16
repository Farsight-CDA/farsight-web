import PropTypes from "prop-types";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import * as React from "react";
import { ChainContent }  from "./chain-content";

export const WatchCard = ({ name }) => {
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
