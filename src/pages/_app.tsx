import Head from "next/head";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "../contexts/auth-context";
import { theme } from "../theme";
import { QueryClient, QueryClientProvider } from "react-query";
import { AxelarProvider } from "../contexts/axelar-context";
import "../styles/globals.css";

const queryClient = new QueryClient();

interface props {
  Component: any;
  pageProps: any;
}

const App = (props: props) => {
  const { Component, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page: any) => page);

  return (
    <>
      <Head>
        <title>Farsight</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <AxelarProvider>
            <AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>
          </AxelarProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
