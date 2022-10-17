import { useRouter } from "next/router";
import Head from "next/head";
import { Box, CircularProgress, Container, Grid, Typography } from "@mui/material";
import { DashboardLayout } from "../../components/dashboard-layout";
import { WatchCard } from "../../components/watch/watch-card";
import { RegisterCard } from "../../components/register/register-card";
import { useQuery } from "react-query";
import { fetchRegistration } from "../../utils/HinterEnde";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const Page = () => {
  const router = useRouter();
  const { name } = router.query;

  if (name !== undefined && name.replace(/[^a-zA-Z0-9]/, '') != name) {
    router.replace("/register/" + name.replace(/[^a-zA-Z0-9]/, ''));
  }

  return (
    <>
      {name == undefined ? (
        <Grid
          container
          spacing={1}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "30vh" }}
        >
          <CircularProgress />
        </Grid>
      ) : (
          <InnerPage name={name.toLowerCase()}></InnerPage>
      )}
    </>
  );
};

const InnerPage = ({ name }) => {
  const { data, status } = useQuery(["registration", name], () => fetchRegistration(name));

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          {status === "loading" && (
            <Grid
              container
              spacing={1}
              direction="column"
              alignItems="center"
              justifyContent="center"
              style={{ minHeight: "30vh" }}
            >
              <CircularProgress />
            </Grid>
          )}
          {status === "error" && (
            <Grid
              container
              spacing={1}
              direction="column"
              alignItems="center"
              justifyContent="center"
              style={{ minHeight: "30vh" }}
            >
              <ErrorOutlineIcon fontSize={"large"} />
            </Grid>
          )}

          {status === "success" && !data.available && <WatchCard name={name} registration={data} />}
          {status === "success" && data.available && <RegisterCard name={name} />}
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
