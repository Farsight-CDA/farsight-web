import PropTypes from "prop-types";
import {
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/auth-context";
import { RegisterStatusCard } from "./register-status-card";
import { useQuery } from "react-query";
import { fetchEstimateRegisterGas, fetchPriceData } from "../../utils/HinterEnde";
import { AxelarContext } from "../../contexts/axelar-context";
import { getChainNameByChainId, getEVMChainByChainId, getNativeAssetByChainId } from "../../utils/ChainTranslation";
import { mainChainId, supportedChains } from "../../utils/chain-ids";
import { BigNumber } from "ethers";

interface RegisterCardProps {
  name: string;
}

export const RegisterCard = ({ name }: RegisterCardProps) => {
  const { isConnected, isSupported, isMainChain, chainId, address } = useContext(AuthContext);
  const { axelarClient } = useContext(AxelarContext);

  const [year, setYear] = useState(1);
  const [buyBool, setBuyBool] = useState(true);

  const { data: registerFee, status: registerFeeStatus } = useQuery(["price", name, year, chainId], async () => {
    return (await fetchPriceData(name, 0, year * 365 * 24 * 60 * 60)).amount;
  });

  const { data: gasFee, status: gasFeeStatus } = useQuery(["register", chainId, isConnected], async () => {
    if (!isSupported || chainId == mainChainId || (chainId === null /* TS Hint*/)) {
      return BigNumber.from(0);
    }

    const registerGas = (await fetchEstimateRegisterGas(
      chainId,
      name,
      address!,
      year * 365 * 24 * 60 * 60
    )).est;

    const gasEstimate = BigNumber.from(await axelarClient.estimateGasFee(
      getEVMChainByChainId(chainId),
      getEVMChainByChainId(mainChainId),
      getNativeAssetByChainId(chainId),
      registerGas
    ));

    //Back and forth plus extra
    var gasFee = gasEstimate.mul(3);
    return gasFee;
  });

  useEffect(() => {
    setBuyBool(true);
  }, [chainId]);

  return (
    <>
      <Typography sx={{ mb: 3, ml: 1 }} variant="h4">
        Register
      </Typography>
      <Grid container spacing={1}>
        <Grid pc={12}>
          <Card>
            <CardContent>
              <Typography align="left" color="textPrimary" gutterBottom variant="h5">
                {name}.far
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid pc={12}>
          <Card>
            <CardContent>
              <Grid container>
                {/* Registration Period */}
                <Grid xs={12} sm={5} md={3}>
                  <Typography color="textPrimary" gutterBottom variant="h6">
                    Registration Period
                  </Typography>
                  <Divider />
                  <Grid container direction={"row"}>
                    <Grid xs={2} sm={2} md={2}>
                      <IconButton
                        onClick={() => (year < 2 ? null : setYear(year - 1))}
                        aria-label="delete"
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Grid>
                    <Grid xs={8} sm={8} md={8}>
                      <Typography
                        align="center"
                        color="textPrimary"
                        gutterBottom
                        variant="h5"
                        minWidth={"11rem"}
                      >
                        {year > 1 ? year + " Years" : year + " Year"}
                      </Typography>
                    </Grid>
                    <Grid xs={2} sm={2} md={2}>
                      <IconButton onClick={() => setYear(year + 1)} aria-label="delete">
                        <AddIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
                {/* Arrow */}
                <Grid
                  xs={2}
                  sm={2}
                  md={1}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <KeyboardDoubleArrowRightIcon fontSize={"large"} />
                </Grid>
                {/* Registration price to pay */}
                <Grid xs={12} sm={5} md={3}>
                  <Typography color="textPrimary" gutterBottom variant="h6">
                    Registration fee
                  </Typography>
                  <Divider />
                  <Typography color="textPrimary" gutterBottom variant="h6" mt={"0.2rem"}>
                    {registerFeeStatus === "success" && <>{registerFee} USDC</>}
                    {registerFeeStatus === "loading" && <>Loading...</>}
                    {registerFeeStatus === "error" && <>Error!</>}
                  </Typography>
                </Grid>
                {/* Arrow */}
                <Grid
                  xs={12}
                  sm={12}
                  md={1}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <KeyboardDoubleArrowRightIcon fontSize={"large"} />
                </Grid>
                {/* Total Price */}
                <Grid xs={12} sm={12} md={4}>
                  <Typography color="textPrimary" gutterBottom variant="h6">
                    The price depending on the chain.
                  </Typography>
                  <Divider />
                  {gasFeeStatus == 'success' && <Typography color="textPrimary" gutterBottom variant="h6" mt={"0.2rem"}>
                    {!isConnected && <>No Wallet Connected</>}
                    {(isConnected && !isSupported) && <>Unsupported Chain</> }
                    {(isMainChain) && <>Bridging not necessary</>}
                    {(isSupported && !isMainChain && (chainId !== null /* TS Hint */)) && <>Bridging: {(gasFee.div("1000000000000000").toNumber() / 1000).toLocaleString()} {getNativeAssetByChainId(chainId)}</>}
                  </Typography>}
                  {gasFeeStatus === 'error' || gasFeeStatus === 'loading' && <Typography color="textPrimary" gutterBottom variant="h6" mt={"0.2rem"}>
                    Bridging: loading...
                  </Typography>}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {buyBool ? (
          <Grid pc={12}>
            <Card>
              <CardContent>
                <Typography sx={{ ml: 5 }} color="textPrimary" variant="h5">
                  This Name is available you can buy it now
                </Typography>

                <Button variant="contained" sx={{ mr: 5 }} onClick={() => setBuyBool(false)}>
                  Buy
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          <>
            <Grid xs={12}>
              <Card>
                <CardContent>
                  <Typography color="textPrimary" gutterBottom variant="h5">
                    Registering a name requires you to complete 4 simple steps
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12}>
              <Card sx={{ p: 3 }}>
                {(isSupported && gasFeeStatus == 'success') && <RegisterStatusCard
                  name={name}
                  duration={year * 365 * 24 * 60 * 60}
                  bridgeFee={gasFee}
                ></RegisterStatusCard>}
                {(!isConnected && gasFeeStatus == 'success') && <p>
                    No Wallet Connected
                  </p>}
                {(isConnected && !isSupported && gasFeeStatus == 'success') && <p>
                    Unsupported Chain!
                    Please connect to {supportedChains.map(cId => getChainNameByChainId(cId)).join(" or ")}
                  </p>}
                {gasFeeStatus == 'loading' && <p>Loading...</p>}
                {gasFeeStatus == 'error' && <p>Failed loading Axelar data. Try again later!</p>}
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

RegisterCard.propTypes = {
  name: PropTypes.string.isRequired,
};
