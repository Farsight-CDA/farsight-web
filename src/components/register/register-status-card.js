import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/auth-context";
import { mainChainId, isSupported } from "../../utils/chain-ids";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

const totalWaitSeconds = 180;

export const RegisterStatusCard = () => {
  const { isConnected, chainId, controller } = useContext(AuthContext);

  const [waitStartTime, setWaitStartTime] = useState(0);

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setActiveStep(
      !isConnected || !isSupportedChain
        ? 0
        : 1
    );
  }, [chainId]);

  console.log(activeStep);

  const isSupportedChain = isSupported(chainId);

  function postCommitTransaction() {

  }

  function postRegisterTransaction() {

  }

  return (
    <Stepper activeStep={activeStep} orientation="vertical">
      <Step>
        <StepLabel>
          <Typography variant="caption">
            Connect your Wallet to a supported Chain
          </Typography>
        </StepLabel>
        <StepContent>
          {!isConnected && <Typography>Wallet not connected!</Typography>}
          {(isConnected && !isSupportedChain) && <Typography>Unsupported Chain!</Typography>}
        </StepContent>
      </Step>

      <Step>
        <StepLabel>
          <Typography variant="caption">
            Commit to your registration On-Chain
          </Typography>
        </StepLabel>
        <StepContent>
          <Typography>
            Accept the transaction in your wallet
          </Typography>
          <Button
            onClick={ postCommitTransaction }
            variant="contained"
          >
            Commit
          </Button>
        </StepContent>
      </Step>
      <Step>
        <StepLabel>
          Wait 3 Minutes
        </StepLabel>
        <StepContent>
          <Typography>
            Please hang tight, you will be able to finalize your registration shortly.
            This wait time ensures that no matter which chain you are buying the domain from,
            there is always enough time for you to register without being front-run
          </Typography>
        </StepContent>
      </Step>
    </Stepper>
  );
}
