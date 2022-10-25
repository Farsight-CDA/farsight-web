import Head from "next/head";
import { Box, Container, Grid, Typography } from "@mui/material";
import { Layout } from "../components/layout/layout";
import * as React from "react";

const Page = () => (
  <>
    <Head>
      <title>Dashboard</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="tablet">
        <Grid
          container
          spacing={1}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "30vh" }}
        >
          <Grid mobile={12}>
            <Typography variant="h3">Farsight</Typography>
          </Grid>
          <Grid mobile={12}>
            <Typography variant="h5">Dashboard / Products</Typography>
          </Grid>
          <Grid mobile={12}>
            <Typography variant="h5">Coming Soon</Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page: any) => <Layout>{page}</Layout>;

export default Page;
