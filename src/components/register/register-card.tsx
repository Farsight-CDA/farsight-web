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

    //const registerGas = (await fetchEstimateRegisterGas(
    //  chainId,
    //  name,
    //  address!,
    //  year * 365 * 24 * 60 * 60
    //)).est;

    const registerGas = 200000;

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
  }, [chainId, address]);

  return (
    <>
      <Typography sx={{ mb: 3, ml: 1 }} variant="h4">
        Register
      </Typography>

      <Grid container spacing={1}>

        <Grid mobile={12}>
          <Card>
            <CardContent>
              <Typography className="mb-0" align="left" color="textPrimary" gutterBottom variant="h5">
                {name}.far
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid mobile={12}>
          <Card>
            <CardContent className="text-center">
              <Grid container className="justify-center items-center">
                {/* Registration Period */}
                <Grid mobile={12} pc={4}>
                  <Typography color="textPrimary" gutterBottom variant="h6">
                    Registration Period
                  </Typography>
                  <Divider />
                  <div className={"flex justify-around"}>
                    <IconButton
                      onClick={() => (year < 2 ? null : setYear(year - 1))}
                      aria-label="delete"
                    >
                      <RemoveIcon />
                    </IconButton>

                    <Typography
                      align="center"
                      color="textPrimary"
                      gutterBottom
                      variant="h5"
                      minWidth={"11rem"}
                    >
                      {year > 1 ? year + " Years" : year + " Year"}
                    </Typography>

                    <IconButton onClick={() => setYear(year + 1)} aria-label="delete">
                      <AddIcon />
                    </IconButton>
                  </div>
                </Grid>

                {/* Arrow */}
                <Grid
                  mobile={12}
                  pc={1}
                  className="flex items-center flex-wrap justify-center"
                >
                  <KeyboardDoubleArrowRightIcon fontSize={"large"} />
                </Grid>

                {/* Registration price to pay */}
                <Grid mobile={12} pc={3}>
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
                  mobile={12}
                  pc={1}
                  className="flex items-center flex-wrap justify-center"
                >
                  <KeyboardDoubleArrowRightIcon fontSize={"large"} />
                </Grid>

                {/* Total Price */}
                <Grid mobile={12} pc={3}>
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
          <Grid mobile={12}>
            <Card>
              <CardContent className="grid">
                <Typography color="textPrimary" variant="h5" className="mb-3">
                  This Name is available you can buy it now
                </Typography>

                <Button variant="contained" onClick={() => setBuyBool(false)}>
                  Buy
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          <>
            <Grid mobile={12}>
              <Card>
                <CardContent>
                  <Typography color="textPrimary" gutterBottom variant="h5">
                    Registering a name requires you to complete 4 simple steps
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid mobile={12}>
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
