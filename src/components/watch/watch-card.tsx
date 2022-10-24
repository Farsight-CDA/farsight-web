import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Card } from "@mui/material";
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
        <Grid xs={12}>
          <Card>
            <Typography
              sx={{
                textAlign: "center",
                m: 3,
              }}
              variant="h5"
            >
              NFT Chain
            </Typography>
          </Card>
        </Grid>
        <Grid xs={12} sx={{ ml: 2, mr: 2 }}>
          {keeperChain === null && <NoKeeperChainHint></NoKeeperChainHint>}
          {keeperChain !== null && <ChainContent
            registration={registration}
            chainState={keeperChain}
            canEdit={canEdit}
          />}
        </Grid>
        <Grid xs={12} sx={{ mt: 3 }}>
          <Card style={{ marginBottom: "5px" }}>
            <Typography
              sx={{
                textAlign: "center",
                m: 3
              }}
              variant="h5"
            >
              Other Supported Chains
            </Typography>
          </Card>
        </Grid>
        <Grid xs={12} sx={{ ml: 2, mr: 2 }} container spacing={3}>
          {registration.chainStates
            .filter((x) => !x.isKeeper)
            .map((state) => (
              <Grid key={state.chainId} xs={6}>
                <ChainContent registration={registration} chainState={state} canEdit={canEdit}/>
              </Grid>
            ))}
        </Grid>
      </Grid>
    </>
  );
};
