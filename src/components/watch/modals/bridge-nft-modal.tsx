import { Button, Card, CardContent, FormControl, FormControlLabel, Grid, Input, InputAdornment, InputLabel, Radio, RadioGroup, Step, StepContent, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import { BigNumber } from "ethers";
import { useContext, useState } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../../../contexts/auth-context";
import { AxelarContext } from "../../../contexts/axelar-context";
import { mainChainId } from "../../../utils/chain-ids";
import { getBridgeTargetNameByChainId, getChainNameByChainId, getEVMChainByChainId, getNativeAssetByChainId } from "../../../utils/ChainTranslation";
import { namehash } from "../../../utils/hash";
import { Registration } from "../../../utils/HinterEnde";

export interface BridgeNFTModalProps {
    keeperChainId: number;
    registration: Registration;
    name: string;
}

export const BridgeNFTModal = ({ keeperChainId, registration, name }: BridgeNFTModalProps) => {
    const { chainId, balance, address, registrar, isSupported } = useContext(AuthContext);

    const { axelarClient, getTransactionExplorerURL } = useContext(AxelarContext);
    
    const [selectedChainId, setSelectedChainId] = useState<string>("");
    const [targetChainId, setTargetChainId] = useState<number | null>(null);

    const [selectedAddress, setSelectedAddress] = useState<string>("");
    const [targetAddress, setTargetAddress] = useState<string | null>(null);

    const [bridgeTx, setBridgeTx] = useState<string | null>(null);

    const { status, data: gasFee } = useQuery(["bridgeGasEstimate", targetChainId], fetchBridgeGasFeeEstimation);

    const activeStep =
        targetChainId === null || status === 'loading' || status === 'error'
            ? 0
            : targetAddress === null
                ? 1
                : 2;

    async function fetchBridgeGasFeeEstimation() {
        if (targetChainId === null) {
            return BigNumber.from(0);
        }

        const registerGas = 1000000; 
        //(await fetchEstimateRegisterGas(
        //    chainId!,
        //    name,
        //    address!,
        //    1 * 365 * 24 * 60 * 60
        //)).est;

        const gasEstimate = BigNumber.from(await axelarClient.estimateGasFee(
            getEVMChainByChainId(chainId!),
            getEVMChainByChainId(mainChainId!),
            getNativeAssetByChainId(chainId!),
            registerGas
        ));

        if (gasEstimate.eq(0)) {
            throw new Error("Failed to estimate gas!");
        }

        //Back and forth plus extra
        var gasFee = gasEstimate.mul(3);
        return gasFee;
    }

    function selectTargetChainId() {
        if (selectedChainId === "") {
            return;
        }

        setTargetChainId(Number.parseInt(selectedChainId));
    }

    function selectTargetAddress() {
        if (selectedAddress === "") {
            return;
        }

        setTargetAddress(selectedAddress);
    }

    async function postBridgeTransaction(){
        if (targetChainId === null || targetAddress === null || status !== 'success'){
            return;
        }

        const selectedChain = getBridgeTargetNameByChainId(targetChainId);

        const receipt = await registrar!.bridgeNameTo(
            selectedChain, 
            namehash(name),
            targetAddress,
            {
                value: gasFee
            }
        );

        const result = await receipt.wait();

        if (result.status != 1) {
            alert("There was an error, please try again!");
            return;
        }

        setBridgeTx(receipt.hash);
    }

    if (!isSupported || chainId !== keeperChainId ||
        chainId === null /* TS Hint */ || registrar === null /* TS Hint */ || balance === null /* TS Hint */) {
        return (<></>);
    }

    return (
        <Card style={{ maxWidth: "4" }}>
            <CardContent sx={{display: "flex", flexDirection: "column"}}>
                <Typography color="textPrimary" gutterBottom variant="h6" mb={4}>
                    Transfer name ownership to another blockchain
                </Typography>

                <Stepper activeStep={activeStep} orientation="vertical">
                    <Step>
                        <StepLabel>
                            Select Target Blockchain
                        </StepLabel>
                        <StepContent>
                                <RadioGroup
                                    value={selectedChainId}
                                    onChange={(val) => setSelectedChainId(val.currentTarget.value)}
                                >
                                    {registration.chainStates.filter(state => state.chainId != chainId).map((state) => (
                                        <FormControlLabel
                                            key={state.chainId}
                                            value={state.chainId}
                                            control={<Radio />}
                                            label={getChainNameByChainId(state.chainId)}
                                        />
                                    ))}
                                </RadioGroup>
                            {(targetChainId === null && status == 'success') && <Button
                                disabled={selectedChainId === ""}
                                variant="contained"
                                color="secondary"
                                onClick={selectTargetChainId}
                            >   
                                Select
                            </Button>}
                            {(targetChainId !== null && status == 'loading' && <Button
                                disabled={true}
                                variant="contained"
                                color="secondary">
                                Loading...
                            </Button>)}
                            
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel>
                            Enter Target Address
                        </StepLabel>
                        <StepContent>
                            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                                <InputLabel>Address on target chain</InputLabel>
                                <Input
                                    value={selectedAddress}
                                    onChange={val => setSelectedAddress(val.currentTarget.value)}
                                />
                            </FormControl>
                            <p>Using a invalid address will result in a loss of name ownership!</p>

                            <Button
                                disabled={selectedAddress === ""}
                                variant="contained"
                                color="secondary"
                                onClick={selectTargetAddress}
                            >
                                Select
                            </Button>          
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel>
                            Post Transaction
                        </StepLabel>
                        <StepContent>
                            {balance < gasFee! && <Typography sx={{color: 'red'}}>
                                Balance too for cross chain fee!
                            </Typography>}
                            {balance < gasFee! && (<Typography sx={{ color: 'red' }}>
                                Require {(gasFee!.div(BigNumber.from("1000000000000000")).toNumber() / 1000).toLocaleString()} {getNativeAssetByChainId(chainId)}
                            </Typography>)}

                            <Button
                                disabled={balance < gasFee!}
                                variant="contained"
                                color="secondary"
                                onClick={postBridgeTransaction}
                            >
                                Submit
                            </Button>     
                            <Button
                                sx={{ m: 2 }}
                                disabled={bridgeTx === null}
                                onClick={() => window.open(getTransactionExplorerURL(bridgeTx == null ? "" : bridgeTx), "_blank")}
                                variant="contained"
                            >
                                View on AxelarScan
                            </Button>
                        </StepContent>
                    </Step>
                </Stepper>
            </CardContent>
        </Card>
    );
};