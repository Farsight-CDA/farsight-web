import {
  Button,
  Card,
  CardContent,
  Dialog,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { useContext, useState } from "react";
import { getChainNameByChainId, getLogoNameByChainId } from "../../utils/ChainTranslation";
import { AuthContext } from "../../contexts/auth-context";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import LockIcon from "@mui/icons-material/Lock";
import { mainChainId } from "../../utils/chain-ids";
import { ChainState, Registration } from "../../utils/HinterEnde";
import { BridgeNFTModal } from "./modals/bridge-nft-modal";
import { CrossChainTransferButton } from "./buttons/cross-chain-transfer-button";
import { IncrementOwnerVersionButton } from "./buttons/increment-owner-version-button";
import { BridgeLocalOwnerButton } from "./buttons/bridge-localowner-button";

interface ChainContentProps {
  registration: Registration;
  ownerAddress: string | null;
  keeperChainId: number | null;
  chainState: ChainState;
  name: string;
}

export const ChainContent = ({ registration, ownerAddress, keeperChainId, chainState, name }: ChainContentProps) => {
  const { isConnected, chainId: connectedChainId, address } = useContext(AuthContext);
  const isKeeperChain = keeperChainId !== null && ownerAddress !== null && keeperChainId === chainState.chainId;

  const { chainId, expiration, localOwner, isKeeper, ownerChangeVersion, registrationVersion } =
    chainState;

  const isExpired = expiration <= new Date().getTime() / 1000;
  const basepath = "/static/images/chainlogos/";

  return ( 
    <Card
      sx={isExpired ? { backgroundColor: "gray" } : null}
      style={
        chainId === connectedChainId
          ? { outline: "0.3rem solid #5048e5" }
          : { outline: "0.1rem solid #5048e5" }
      }
    >
      <CardContent>

        <div className="flex justify-between items-center border-b-2 border-solid pb-2">
          <Typography className="" 
                      color="textPrimary" variant="h5">
            {getChainNameByChainId(chainId)}
          </Typography>
          <img src={basepath + getLogoNameByChainId(chainId)} className="w-12" />
        </div>

        {isExpired 
        ?
          (
            <>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <LockIcon fontSize={"large"} sx={{ ml: 1 }} />
                <p>Uninitialized or Expired</p>

                <BridgeLocalOwnerButton
                  name={name}
                  registration={registration}
                  ownerAddress={ownerAddress}
                  keeperChainId={keeperChainId}
                />
              </div>
            </>
          )
        :
          (
            <>
              <Typography color="textPrimary" gutterBottom variant="h6">
                LocalOwner: {localOwner.slice(0, 7) + "..." + localOwner.slice(21, 28)}
              </Typography>
              <Typography color="textPrimary" gutterBottom variant="h6">
                ExpiresAt: {new Date(Number(expiration * 1000)).toLocaleString()}
              </Typography>
              <Typography color="textPrimary" gutterBottom variant="h6">
                Version: {registrationVersion}.{ownerChangeVersion}
              </Typography>

              <div className="flex justify-between">
                {isKeeperChain && (
                  <div className="flex flex-row">
                    <CrossChainTransferButton
                      name={name}
                      registration={registration}
                      ownerAddress={ownerAddress}
                      keeperChainId={keeperChainId}
                    />
                    <div className="px-2" />
                    <IncrementOwnerVersionButton
                      name={name}
                      registration={registration}
                      ownerAddress={ownerAddress}
                      keeperChainId={keeperChainId}
                    />
                  </div>
                )}
                <div className="px-2"></div> {/* Spacer */}
                <BridgeLocalOwnerButton
                  name={name}
                  registration={registration}
                  ownerAddress={ownerAddress}
                  keeperChainId={keeperChainId}
                />
              </div>
            </>
          )
        }
      </CardContent>
    </Card>
  );
};
