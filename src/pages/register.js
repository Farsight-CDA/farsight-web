import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Grid,
  Typography,
} from "@mui/material";
import { Search as SearchIcon } from "../icons/search";
import { DashboardLayout } from "../components/dashboard-layout";
import { chainIdToSvg } from "../utils/ChainTranslation";
import * as React from "react";

const Page = () => {
  const [name, setName] = useState("");

  const router = useRouter();

  const handleKeyDown = (e) => {
    if (e.keyCode !== 13) {
      return;
    }

    router.push("register/" + name.toLowerCase());
  };

  const basepath = "/static/images/";

  return (
    <>
      <Head>
        <title>Register </title>
      </Head>
      <Box
        style={{
          'backgroundImage': `url("/static/images/desert-482068432.jpg")` }}
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
            style={{
              minHeight: "30vh",
            }}
          >
            <Grid item xs={12}>
              <img src={basepath + "Logo FarSight v1.3.svg"} width="300" height="300" />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h3">Farsight</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5">Names</Typography>
            </Grid>
            <Grid item sm={12}>
              <TextField
                fullWidth
                value={name}
                onChange={(x) => setName(x.target.value.replace(/[^a-zA-Z0-9]/, ''))}
                onKeyDown={handleKeyDown}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon fontSize="small" color="action">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                size="medium"
                placeholder="Search on-chain name"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
