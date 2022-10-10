import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { Box, Container, Card, CardContent, TextField, InputAdornment, SvgIcon } from "@mui/material";
import { Search as SearchIcon } from "../icons/search";
import { DashboardLayout } from "../components/dashboard-layout";

const Page = () => {
  const [name, setName] = useState('');

  const router = useRouter();

  const handleKeyDown = e => {
    if (e.keyCode !== 13) {
      return;
    }

    router.push("register/" + name);
  }

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
        <Container maxWidth={false}>

        <Box sx={{ mt: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ maxWidth: 500 }}>
                <TextField
                  fullWidth
                  value={name}
                  onChange={x => setName(x.target.value)}
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
                  placeholder="Search on-chain name"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>

        </Container>
      </Box>
    </>
  );
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
