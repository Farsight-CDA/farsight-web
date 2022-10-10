import PropTypes from "prop-types";
import { Avatar, Box, Card, CardContent, Divider, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import Grid from "@mui/material/Unstable_Grid2";
import { useState } from "react"; // Grid version 2

export const RegisterCard = ({ product }) => {
  const [year, setYear] = useState(1);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",

          justifyContent: "space-between",
        }}
      >
        <Typography align="left" color="textPrimary" gutterBottom variant="h5">
          {product.ADRESS + "." + product.PARENT}
        </Typography>
        <Divider />
        <Grid container spacing={1} sx={{ mt: "0.35em" }}>
          <Grid item sx={{ whiteSpace: "nowrap" }}>
            <Typography color="textPrimary" gutterBottom variant="h7">
              Registration Period
            </Typography>
            <Divider />
            <Typography
              align="inherit"
              color="textPrimary"
              gutterBottom
              variant="h5"
              minWidth={"11rem"}
            >
              <IconButton onClick={() => (year < 2 ? null : setYear(year - 1))} aria-label="delete">
                <RemoveIcon />
              </IconButton>
              {year > 1 ? year + " Year" : year + " Years"}
              <IconButton onClick={() => setYear(year + 1)} aria-label="delete">
                <AddIcon />
              </IconButton>
            </Typography>
          </Grid>
          <Grid item mt={"0.5rem"}>
            <KeyboardDoubleArrowRightIcon fontSize={"large"} />
          </Grid>
          <Grid item sx={{ whiteSpace: "nowrap" }}>
            <Typography color="textPrimary" gutterBottom variant="h7">
              Registration price to pay
            </Typography>
            <Divider />
            <Typography color="textPrimary" gutterBottom variant="h5" mt={"0.2rem"}>
              {product.REGISTRATIONPRICE}
            </Typography>
          </Grid>
          <Grid item>
            <Typography color="textPrimary" gutterBottom variant="h7">
              Estimated Total (Price + Gas). The gas price is based at 7 Gwei
            </Typography>
            <Divider />
            <Typography color="textPrimary" gutterBottom variant="h5" mt={"0.2rem"}>
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
          <Grid item>
            <Typography color="textPrimary" gutterBottom variant="h7">
              * Favorite the name for easy access in case you close out of your browser.
            </Typography>
            <Divider />
            <Typography color="textPrimary" gutterBottom variant="h5">
              Registering a name requires you to complete 3 steps
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid xs={4}>
            <Typography color="textPrimary" gutterBottom variant="h6">
              Request to register
            </Typography>
            <Typography color="textPrimary" gutterBottom variant="h7">
              Your wallet will open and you will be asked to confirm the first of two transactions
              required for registration. If the second transaction is not processed within 7 days of
              the first, you will need to start again from step 1.
            </Typography>
          </Grid>
          <Grid xs={4}>
            <Typography color="textPrimary" gutterBottom variant="h6">
              Wait for 1 minute
            </Typography>
            <Typography color="textPrimary" gutterBottom variant="h7">
              The waiting period is required to ensure another person hasn’t tried to register the
              same name and protect you after your request
            </Typography>
          </Grid>
          <Grid xs={4}>
            <Typography color="textPrimary" gutterBottom variant="h6">
              Complete Registration
            </Typography>
            <Typography color="textPrimary" gutterBottom variant="h7">
              Click ‘register’ and your wallet will re-open. Only after the 2nd transaction is
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              confirmed you'll know if you got the name.
            </Typography>
          </Grid>
        </Grid>
        <Divider />
        <Box>
          <Grid container spacing={1} sx={{ mt: "0.35em" }}>
            <Grid item xs={3}>
              <Typography color="textPrimary" gutterBottom variant="h5">
                PARENT
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="textPrimary" gutterBottom variant="h6">
                {product.PARENT}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container spacing={1} sx={{ mt: "0.35em" }}>
            <Grid item xs={3}>
              <Typography color="textPrimary" gutterBottom variant="h5">
                REGISTRANT
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="textPrimary" gutterBottom variant="h7">
                eth
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container spacing={3} sx={{ mt: "0.35em" }}>
            <Grid item xs={3}>
              <Typography color="textPrimary" gutterBottom variant="h5">
                CONTROLLER
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="textPrimary" gutterBottom variant="h7">
                eth
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container spacing={1} sx={{ mt: "0.35em" }}>
            <Grid item xs={3}>
              <Typography color="textPrimary" gutterBottom variant="h5">
                RESOLVER
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="textPrimary" gutterBottom variant="h7">
                eth
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

RegisterCard.propTypes = {
  product: PropTypes.object.isRequired,
};
