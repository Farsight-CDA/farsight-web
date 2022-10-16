import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../contexts/auth-context";
import { mainChainId, isSupported } from "../../utils/chain-ids";
import { commitment, namehash } from "../../utils/hash";
import { Button, Step, StepContent, StepLabel, Stepper, Typography } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { func } from "prop-types";

const minCommitmentAge = 180;
const maxCommitmentAge = 1800;

export const RegisterStatusCard = ({ name, duration }) => {
  //Global State
  const [_r, setReRender] = useState(false); //Only used to rerender
  const rerenderRef = useRef();
  rerenderRef.current = _r;

  const [activeStep, setActiveStep] = useState(0);
  const [waitingForTx, setWaitingForTx] = useState(false);

  const {
    isConnected,
    address,
    chainId,
    controller,
    paymentProvider,
    paymentToken,
    secret,
    ResetSecret,
  } = useContext(AuthContext);
  const isSupportedChain = isSupported(chainId);
  const commitmentHash =
    name != null && address != null
      ? commitment(BigInt(namehash(name)), address, duration, secret)
      : null;

  //Step State
  const [price, setPrice] = useState(null);

  const [approvedBalance, setApprovedBalance] = useState(false);
  const isApproved = price != null && approvedBalance >= price;
  const [balance, setBalance] = useState(false);
  const hasBalance = price != null && balance >= price;

  const [commitmentTime, setCommitmentTime] = useState(null);
  const hasCommitment =
    commitmentTime != null && commitmentTime + maxCommitmentAge > new Date().getTime() / 1000;
  const waitProgress = Math.min(
    100,
    (100 * (new Date().getTime() / 1000 - commitmentTime)) / minCommitmentAge
  );
  const waitCompleted =
    commitmentTime != null && commitmentTime + minCommitmentAge < new Date().getTime() / 1000;

  useEffect(() => {
    const interval = setInterval(() => {
      setReRender(!rerenderRef.current);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    updateSteps();
  }, [isConnected, chainId, activeStep, approvedBalance, balance, commitmentTime]);

  useEffect(() => {
    loadInitialValues();
  }, [chainId]);

  async function loadInitialValues() {
    if (!isConnected) {
      setPrice(null);
      setApprovedBalance(0);
      setBalance(0);
      setCommitmentTime(null);
      await updateSteps();
      return;
    }

    const _approvedBalance = BigInt(await paymentToken.allowance(address, paymentProvider.address));
    const _balance = BigInt(await paymentToken.balanceOf(address));
    const _commitmentTime = Number(await controller.getCommitment(commitmentHash));
    const _price = BigInt(await paymentProvider.getPrice(name, 0, duration));

    setApprovedBalance(_approvedBalance);
    setBalance(_balance);
    setCommitmentTime(_commitmentTime);
    setPrice(_price);
  }

  async function updateSteps() {
    var step = 4;

    if (!waitCompleted) {
      step = 3;
    }
    if (!hasCommitment) {
      step = 2;
    }
    if (!isApproved || !hasBalance) {
      step = 1;
    }
    if (!isConnected || !isSupportedChain) {
      step = 0;
    }

    if (step != activeStep) {
      setActiveStep(step);
    }
  }

  async function postApproveTransaction() {
    if (waitingForTx) {
      return;
    }

    setWaitingForTx(true);

    try {
      const receipt = await paymentToken.approve(
        paymentProvider.address,
        100000000000000000000000000000n
      );
      const result = await receipt.wait();

      if (result.status != 1) {
        alert("There was an error, please try again!");
        return;
      }

      setApprovedBalance(100000000000000000000000000000n);
    } finally {
      setWaitingForTx(false);
    }
  }

  async function postCommitTransaction() {
    if (waitingForTx) {
      return;
    }

    setWaitingForTx(true);

    try {
      const receipt = await controller.commit(commitmentHash);
      const result = await receipt.wait();

      if (result.status != 1) {
        alert("There was an error, please try again!");
        return;
      }

      setCommitmentTime(new Date().getTime() / 1000);
    } finally {
      setWaitingForTx(false);
    }
  }

  async function postRegisterTransaction() {
    if (waitingForTx) {
      return;
    }

    setWaitingForTx(true);

    try {
      //ToDo: Handle payment estimation for briding
      const receipt = await controller.register(name, address, duration, secret);
      const result = await receipt.wait();

      if (result.status != 1) {
        alert("There was an error, please try again!");
        return;
      }
      ResetSecret();
      location.reload();
    } finally {
      setWaitingForTx(false);
    }
  }

  return (
    <Stepper activeStep={activeStep} orientation="vertical">
      <Step>
        <StepLabel>
          <Typography variant="caption">Connect your Wallet to a supported Chain</Typography>
        </StepLabel>
        <StepContent>
          {!isConnected && <Typography>Wallet not connected!</Typography>}
          {isConnected && !isSupportedChain && <Typography>Unsupported Chain!</Typography>}
        </StepContent>
      </Step>

      <Step>
        <StepLabel>
          <Typography variant="caption">Approve Farsight for USDC</Typography>
        </StepLabel>
        <StepContent>
          {!isApproved && (
            <>
              <h1>Not Approved!</h1>
              <Button disabled={waitingForTx} onClick={postApproveTransaction} variant="contained">
                Approve
              </Button>
            </>
          )}

          {!hasBalance && <Typography>Your balance is too low!</Typography>}
        </StepContent>
      </Step>

      <Step>
        <StepLabel>
          <Typography variant="caption">Commit to your registration On-Chain</Typography>
        </StepLabel>
        <StepContent>
          <Typography sx={{ mr: 5 }} variant="caption">
            Accept the transaction in your wallet
          </Typography>
          <Button disabled={waitingForTx} onClick={postCommitTransaction} variant="contained">
            Commit
          </Button>
        </StepContent>
      </Step>
      <Step>
        <StepLabel>
          <Typography variant="caption">
            Commit to your registration On-Chain Wait 3 Minutes
          </Typography>
        </StepLabel>
        <StepContent>
          <Typography>
            Please hang tight, you will be able to finalize your registration shortly. This wait
            time ensures that no matter which chain you are buying the domain from, there is always
            enough time for you to register without being front-run
          </Typography>

          <LinearProgress sx={{ mt: 2, mb: 2 }} variant="determinate" value={waitProgress} />

          <Button disabled={!waitCompleted} onClick={() => setActiveStep(4)} variant="contained">
            Continue
          </Button>
        </StepContent>
      </Step>
      <Step>
        <StepLabel>
          <Typography variant="caption">Complete Registration</Typography>
        </StepLabel>
        <StepContent>
          <Typography>This step will claim the name NFT to your wallet.</Typography>
          <Button
            sx={{ mt: 2, mb: 2 }}
            disabled={waitingForTx}
            onClick={postRegisterTransaction}
            variant="contained"
          >
            Claim
          </Button>
        </StepContent>
      </Step>
    </Stepper>
  );
};
