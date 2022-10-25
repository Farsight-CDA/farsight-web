import { Button, Dialog, Grid, Tooltip } from "@mui/material"
import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/auth-context";
import { Registration } from "../../../utils/HinterEnde";
import { BridgeNFTModal } from "../modals/bridge-nft-modal";
import { IncrementOwnerVersionModal } from "../modals/increment-owner-version-modal";

interface IncrementOwnerVersionButtonProps {
    name: string;
    registration: Registration;
    ownerAddress: string;
    keeperChainId: number;
}

export const IncrementOwnerVersionButton = ({ name, registration, ownerAddress, keeperChainId }: IncrementOwnerVersionButtonProps) => {
    const { isConnected, address, chainId } = useContext(AuthContext);

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    return (
        <>
            <Tooltip
                title={
                    !isConnected
                        ? "Please connect your wallet"
                        : ownerAddress != address
                            ? "Unauthorized"
                            : chainId !== keeperChainId
                            ? "You are connected to another chain"
                            : "Invalidate records from the previous owner"
                }
            >
                <span>
                    <Button
                        disabled={chainId !== keeperChainId}
                        variant="contained"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        Increment Owner Version
                    </Button>
                </span>
            </Tooltip>
            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
                <IncrementOwnerVersionModal></IncrementOwnerVersionModal>
            </Dialog>
        </>
    );
}