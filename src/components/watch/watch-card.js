import PropTypes from "prop-types";
import { Button, Card, CardContent, Tooltip, Typography } from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { useEffect, useState } from "react";
import { chainIdToName, chainIdToSvg } from "../../utils/ChainTranslation";

const ChainContent = ({ params }) => {
  const [expired, setExpired] = useState(true);
  const basepath = "/static/images/chainlogos/";

  useEffect(() => {
    if (params.content[0].expiration > new Date().getTime()) {
      setExpired(false);
    }
  }, [params]);

  console.log(params.content[0].expiration);
  console.log(new Date(params.content[0].expiration));

  return (
    <>
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
        <Grid xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
          <Tooltip title={new Date(params.content[0].expiration).toString()}>
            <span>
              <Button disabled={expired} variant="contained">
                {expired ? "Expired" : "Open"}
              </Button>
            </span>
          </Tooltip>
        </Grid>
      </Grid>
    </>
  );
};

export const WatchCard = ({ contents }, { name }) => {
  return (
    <>
      <Grid container spacing={1}>
        <Grid xs={12}>
          <Card>
            <CardContent>
              <ChainContent params={contents[0]} />
            </CardContent>
          </Card>
        </Grid>
        {contents.slice(1).map((content) => (
          <Grid key={content.chainId + name} xs={6}>
            <Card>
              <CardContent>
                <ChainContent params={content} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

WatchCard.propTypes = {
  contents: PropTypes.object.isRequired,
};
