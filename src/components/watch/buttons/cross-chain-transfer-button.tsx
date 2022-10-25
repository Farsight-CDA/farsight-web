import { Button, Dialog, Grid, Tooltip } from "@mui/material"
import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/auth-context";
import { Registration } from "../../../utils/HinterEnde";
import { BridgeNFTModal } from "../modals/bridge-nft-modal";

interface CrossChainTransferButtonProps {
    name: string;
    registration: Registration;
    ownerAddress: string;
    keeperChainId: number;
}

export const CrossChainTransferButton = ({ name, registration, ownerAddress, keeperChainId }: CrossChainTransferButtonProps) => {
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
                                : "Transfer name ownership to a different blockchain"
                }
            >
                <span>
                    <Button
                        disabled={chainId !== keeperChainId}
                        variant="contained"
                        color="secondary"
                        className="bg-blue"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        Cross Chain Transfer
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
                <BridgeNFTModal registration={registration} name={name} keeperChainId={keeperChainId}></BridgeNFTModal>
            </Dialog>
        </>
    );
}