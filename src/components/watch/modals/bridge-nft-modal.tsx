import { Button, Card, CardContent, FormControl, FormControlLabel, Grid, Input, InputAdornment, InputLabel, Radio, RadioGroup, Step, StepContent, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/auth-context";
import { getChainNameByChainId } from "../../../utils/ChainTranslation";
import { Registration } from "../../../utils/HinterEnde";

export interface BridgeNFTModalProps {
    registration: Registration;
}

export const BridgeNFTModal = ({ registration }: BridgeNFTModalProps) => {
    const { isMainChain, chainId, registrar } = useContext(AuthContext);

    const [activeStep, setActiveStep] = useState<number>(0);
    
    const [selectedChainId, setSelectedChainId] = useState<string>("");
    const [targetChainId, setTargetChainId] = useState<number | null>(null);

    const [selectedAddress, setSelectedAddress] = useState<string>("");
    const [targetAddress, setTargetAddress] = useState<string>("");

    if (!isMainChain || chainId === null /* TS Hint */ || registrar === null /* TS Hint */) {
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

    function postBridgeTransaction(){
        
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

                        </StepContent>
                    </Step>
                </Stepper>
            </CardContent>
        </Card>
    );
};