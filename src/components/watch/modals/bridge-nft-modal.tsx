import { EvmChain } from "@axelar-network/axelarjs-sdk";
import { Button, Card, CardContent, FormControl, FormControlLabel, Grid, Input, InputAdornment, InputLabel, Radio, RadioGroup, Step, StepContent, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/auth-context";
import { getChainNameByChainId, getEVMChainByChainId } from "../../../utils/ChainTranslation";
import { namehash } from "../../../utils/hash";
import { Registration } from "../../../utils/HinterEnde";

export interface BridgeNFTModalProps {
    keeperChainId: number;
    registration: Registration;
    name: string;
}

export const BridgeNFTModal = ({ keeperChainId, registration, name }: BridgeNFTModalProps) => {
    const { chainId, registrar } = useContext(AuthContext);

    const [activeStep, setActiveStep] = useState<number>(0);
    
    const [selectedChainId, setSelectedChainId] = useState<string>("");
    const [targetChainId, setTargetChainId] = useState<number | null>(null);

    const [selectedAddress, setSelectedAddress] = useState<string>("");
    const [targetAddress, setTargetAddress] = useState<string | null>(null);

    const [bridgeTx, setBridgeTx] = useState<string | null>(null);


    if (chainId !== keeperChainId || chainId === null /* TS Hint */ || registrar === null /* TS Hint */) {
        return (<></>);
    }

    function selectTargetChainId() {
        if (selectedChainId === "") {
            return;
        }

        setTargetChainId(Number.parseInt(selectedChainId));
        setActiveStep(1);
    }

    function selectTargetAddress() {
        if (selectedAddress === "") {
            return;
        }

        setTargetAddress(selectedAddress);
        setActiveStep(2);
    }

    async function postBridgeTransaction(){
        if (targetChainId === null || targetAddress === null){
            return;
        }

        const selectedChain = getEVMChainByChainId(targetChainId);

        const receipt = await registrar!.bridgeNameTo(
            selectedChain, 
            namehash(name),
            targetAddress    
        );

        const result = await receipt.wait();

        if (result.status != 1) {
            alert("There was an error, please try again!");
            return;
        }

        setBridgeTx(receipt.hash);
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
                            <Button
                                disabled={selectedChainId === ""}
                                variant="contained"
                                color="secondary"
                                onClick={selectTargetChainId}
                            >   
                                Select
                            </Button>
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
                            <Button
                                disabled={selectedAddress === ""}
                                variant="contained"
                                color="secondary"
                                onClick={postBridgeTransaction}
                            >
                                Submit
                            </Button>     
                            <Button
                                sx={{ m: 2 }}
                                disabled={bridgeTx === null}
                                onClick={() => window.open("https://axelarscan.io/gmp/" + bridgeTx, "_blank")}
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