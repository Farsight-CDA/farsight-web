import { useRouter } from "next/router";
import Head from "next/head";
import { Box, Container, Grid, Typography } from "@mui/material";
import { DashboardLayout } from "../../components/dashboard-layout";
import { RegisterCard } from "../../components/register/register-card";
import { addresses } from "../../__mocks__/addresses";
const Page = () => {
  const router = useRouter();
  const { name } = router.query;

  return (
    <>
      <Head>
        <title>Register | Material Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography sx={{ mb: 3 }} variant="h4">
            Register
          </Typography>
          <RegisterCard product={addresses[0]} year={1} />
          <Grid container spacing={3}></Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
