import Head from "next/head";
import { Box, Container, Grid, Typography } from "@mui/material";
import { DashboardLayout } from "../components/dashboard-layout";
import * as React from "react";

const Page = () => (
  <>
    <Head>
      <title>Dashboard | Material Kit</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={1}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "30vh" }}
        >
          <Grid item xs={12}>
            <Typography variant="h3">Farsight</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5">Dashbord / Products</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5">Comming Soon</Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
