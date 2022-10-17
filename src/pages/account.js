import Head from "next/head";
import { Box, Container, Grid, Typography } from "@mui/material";
import { DashboardLayout } from "../components/dashboard-layout";

const Page = () => {
  return (
    <>
      <Head>
        <title>Account | Material Kit</title>
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
              <Typography variant="h5">Accounts</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5">Coming Soon</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
