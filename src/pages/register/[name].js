import { useRouter } from "next/router";
import Head from "next/head";
import { Box, Container, Grid, Typography } from "@mui/material";
import { DashboardLayout } from "../../components/dashboard-layout";
import { WatchCard } from "../../components/watch/watch-card";
import { RegisterCard } from "../../components/register/register-card";
import { useQuery } from "react-query";
import { fetchRegistration } from "../../utils/HinterEnde";

const Page = () => {
  const router = useRouter();
  const { name } = router.query;

  console.log(name);

  return (
    <>
      {(name == undefined)
        ? <p>Loading</p>
        : <InnerPage name={name}></InnerPage>
      }
    </>
  );
}

const InnerPage = ({ name }) => {
  const router = useRouter();
  const { data, status } = useQuery(["registration", name], () => fetchRegistration(name));

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
          {status === "loading" && <p>Loading....</p>}
          {status === "error" && <p>There was an error....</p>}

          {status === "success" && !data.available && <WatchCard name={name} registration={data} />}
          {status === "success" && data.available && <RegisterCard name={name} />}
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
