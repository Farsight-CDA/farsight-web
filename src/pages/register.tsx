import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  TextField,
  InputAdornment,
  SvgIcon,
  Grid,
  Typography,
} from "@mui/material";
import { Search as SearchIcon } from "../icons/search";
import { Layout } from "../components/layout/layout";
import * as React from "react";

const Page = () => {
  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [showError, setShowError] = useState(false);

  const router = useRouter();

  const handleKeyDown = (e: { keyCode: number }) => {
    setShowError(true);

    if (e.keyCode !== 13 || !validName) {
      return;
    }

    router.push("/register/" + name);
  };

  const handleInput = (input: string) => {
    input = input.replace(/[^a-zA-Z0-9]/, "").toLowerCase();
    setName(input);
    setShowError(true);

    if (input.length < 4 || input.length > 32) {
      setValidName(false);
    } else {
      setValidName(true);
    }
  };

  const basepath = "/static/images/";

  return (
    <>
      <Head>
        <title>Register </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <Grid
            container
            spacing={1}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{
              minHeight: "30vh",
              backgroundColor: "darkgray",
              padding: "50px",
              borderRadius: "25px",
              width: "auto",
            }}
          >
            <Grid mobile={12}>
              <img src={basepath + "Logo FarSight v1.3.svg"} width="300" height="300" />
            </Grid>
            <Grid mobile={12}>
              <Typography variant="h3">Farsight</Typography>
            </Grid>
            <Grid mobile={12} className="mb-10">
              <Typography variant="h5">Names</Typography>
            </Grid>
            <Grid mobile={12}>
              <TextField
                fullWidth
                value={name}
                onChange={(x) => handleInput(x.target.value)}
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
              {!validName && showError && name != "" && (
                <Typography style={{ textAlign: "center", color: "red", marginTop: "8px" }}>
                  {name.length < 4 && <>Minimum 4 characters</>}
                  {name.length > 32 && <>At most 32 characters</>}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};
Page.getLayout = (page: any) => <Layout backgroundImage='url("/static/images/desert-482068432.jpg")'>{page}</Layout>;

export default Page;
