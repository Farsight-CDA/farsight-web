import { Fragment } from "react";
import Head from "next/head";
import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AuthConsumer, AuthProvider } from "../contexts/auth-context";
import { createEmotionCache } from "../utils/create-emotion-cache";
import { registerChartJs } from "../utils/register-chart-js";
import { theme } from "../theme";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

registerChartJs();

const clientSideEmotionCache = createEmotionCache();
const queryClient = new QueryClient()

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Farsight</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <AuthConsumer>
                {(auth) => (auth.isLoading ? <Fragment /> : getLayout(<Component {...pageProps} />))}
              </AuthConsumer>
            </AuthProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default App;
