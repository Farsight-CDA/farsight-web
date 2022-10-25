import { Button, Dialog, Grid, Tooltip } from "@mui/material"
import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/auth-context";
import { Registration } from "../../../utils/HinterEnde";
import { BridgeLocalOwnerModal } from "../modals/bridge-localowner-modal";

interface BridgeLocalOwnerButtonProps {
    name: string;
    registration: Registration;
    ownerAddress: string | null;
    keeperChainId: number | null;
}

export const BridgeLocalOwnerButton = ({ name, registration, ownerAddress, keeperChainId }: BridgeLocalOwnerButtonProps) => {
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
                                ? "Connect to your NFT chain"
                                : "Set the localOwner on this chain"
                }
            >
                <span>
                    <Button
                        disabled={chainId !== keeperChainId}
                        variant="contained"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        Set LocalOwner
                    </Button>
                </span>
            </Tooltip>

            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="flex items-center justify-center"
            >
                <BridgeLocalOwnerModal></BridgeLocalOwnerModal>
            </Dialog>
        </>
    );
}