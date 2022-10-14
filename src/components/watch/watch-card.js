import PropTypes from "prop-types";
import { Button, Card, CardContent, Typography } from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { useEffect, useState } from "react";

const ChainContent = ({ content }) => {
  const [expired, setExpired] = useState(true);

  useEffect(() => {
    if (content.EXPIRATIONDATE > new Date()) {
      setExpired(false);
    }
  }, [content]);

  return (
    <>
      <Grid container spacing={0.5}>
        <Grid xs={12}>
          <Typography color="textPrimary" gutterBottom variant="h4">
            {content.CHAINID}
          </Typography>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <Typography color="textPrimary" gutterBottom variant="h5">
            {content.ADDRESS}
          </Typography>
        </Grid>

        <Grid xs={12} sm={6} md={4} style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button disabled={expired} variant="contained">
            {expired ? "Expired" : "Open"}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export const WatchCard = ({ contents }) => {
  return (
    <>
      <Grid container spacing={1}>
        <Grid xs={12}>
          <Card>
            <CardContent>
              <ChainContent content={contents[0]} />
            </CardContent>
          </Card>
        </Grid>
        {contents.slice(1).map((content) => (
          <Grid key={content.id} xs={6}>
            <Card>
              <CardContent>
                <ChainContent content={content} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

WatchCard.propTypes = {
  product: PropTypes.object.isRequired,
};
