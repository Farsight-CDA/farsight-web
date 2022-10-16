import { useRouter } from "next/router";
import Head from "next/head";
import { Box, Container, Grid, Typography } from "@mui/material";
import { DashboardLayout } from "../../components/dashboard-layout";
import { addresses } from "../../__mocks__/addresses";
import { WatchCard } from "../../components/watch/watch-card";
import { RegisterCard } from "../../components/register/register-card";
import { useEffect, useState, useContext } from "react";
import { useQuery } from "react-query";
import { mainChainId } from "../../utils/chain-ids";
import { AuthContext } from "../../contexts/auth-context";
import { namehash } from "../../utils/hash";

const Page = () => {
  const router = useRouter();
  const { name } = router.query;
  const { chainId, isConnected, registrar } = useContext(AuthContext);

  const fetchOccupation = async () => {
    if (isConnected && chainId === mainChainId) {
      const expiration = await registrar.getNameExpiration(namehash(name));
      return expiration != 0;
    }

    return false;
  };

  const { data, status } = useQuery(["occupation", name], fetchOccupation);

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

          {status === "success" && data && <WatchCard name={name} />}
          {status === "success" && !data && <RegisterCard product={addresses[0]} name={name} />}
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
