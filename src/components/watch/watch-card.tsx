import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Card, CardContent } from "@mui/material";
import * as React from "react";
import { ChainContent } from "./chain-content";
import { Typography } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth-context";
import { Registration } from "../../utils/HinterEnde";
import { NoKeeperChainHint } from "./no-keeper-chain";

interface WatchCardProps {
  name: string;
  registration: Registration;
}

export const WatchCard = ({ name, registration }: WatchCardProps) => {
  const { chainId, expiration, localOwner, isKeeper, ownerChangeVersion, registrationVersion } =
    registration.chainStates[0];
  const { address } = useContext(AuthContext);

  const keeperChains = registration.chainStates.filter((x) => x.isKeeper);
  const keeperChain = keeperChains.length == 1
    ? keeperChains[0]
    : null;

  const canEdit = keeperChain !== null && address != null &&
    keeperChain.localOwner.toLowerCase() == address.toLowerCase();

  return (
    <>
      <Typography sx={{ mb: 3, ml: 1 }} variant="h4">
        {name}.far {canEdit && <>(Yours)</>}
      </Typography>
      <Grid container spacing={1}>
        <Grid mobile={12}>
          <Card>
            <CardContent>
              <Typography
                className="text-center"
                variant="h5"
              >
                NFT Chain
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid mobile={12} className="mx-5">
          {keeperChain === null && <NoKeeperChainHint></NoKeeperChainHint>}
          {keeperChain !== null && <ChainContent
            registration={registration}
            chainState={keeperChain}
            name={name}
            ownerAddress={keeperChain.localOwner}
            keeperChainId={keeperChain.chainId}
          />}
        </Grid>

        <Grid mobile={12} sx={{ mt: 3 }}>
          <Card style={{ marginBottom: "5px" }}>
            <CardContent>
              <Typography
                className="text-center"
                variant="h5"
              >
                Other Supported Chains
              </Typography>
            </CardContent>
          </Card>
        </Grid>

          {registration.chainStates
            .filter((x) => !x.isKeeper)
            .map((state) => (
              <Grid key={state.chainId} 
                    mobile={12} pc={6}
                    className="mx-5">
                <ChainContent 
                  registration={registration} 
                  chainState={state} 
                  name={name}
                  ownerAddress={keeperChain === null ? null : keeperChain.localOwner}
                  keeperChainId={keeperChain === null ? null : keeperChain.chainId}
                />
              </Grid>
            ))}
      </Grid>
    </>
  );
};
