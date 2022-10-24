import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../contexts/auth-context";
import { commitment, namehash } from "../../utils/hash";
import { Button, Step, StepContent, StepLabel, Stepper, Typography } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { environment } from "../../utils/environment";
import { Environment } from "@axelar-network/axelarjs-sdk";
import { BigNumber } from "ethers";
import { AxelarContext } from "../../contexts/axelar-context";

const minCommitmentAge = environment == Environment.DEVNET ? 30 : 180;
const maxCommitmentAge = 3600;

interface RegisterStatusCardProps {
  name: string;
  duration: number;
  bridgeFee: BigNumber;
}


//Only drawn if isConnected, isSupported are true
export const RegisterStatusCard = ({ name, duration, bridgeFee }: RegisterStatusCardProps) => {
  const {
    chainId,
    address,
    paymentToken,
    controller,
    paymentProvider,
    secret,
    isMainChain,
    ResetSecret
  } = useContext(AuthContext);
  const { getTransactionExplorerURL } = useContext(AxelarContext);

  const commitmentHash = commitment(BigInt(namehash(name)), address!, duration, secret);
  
  async function loadStatusFromChain() {
    const _approvedBalance = await paymentToken!.allowance(address!, paymentProvider!.address);
    const _balance = await paymentToken!.balanceOf(address!);
    const _commitmentTime = await controller!.getCommitment(commitmentHash);
    const _price = await paymentProvider!.getPrice(name, 0, duration);

    setApprovedBalance(_approvedBalance.toBigInt());
    setBalance(_balance.toBigInt());
    setCommitmentTime(_commitmentTime.toNumber());
    setPrice(_price.toBigInt());

    await updateSteps();
  }

  //Global State
  const [_r, setReRender] = useState<boolean>(false); //Only used to rerender
  const rerenderRef = useRef<boolean>();
  rerenderRef.current = _r;

  const [activeStep, setActiveStep] = useState<number>(0);

  const [waitingForTx, setWaitingForTx] = useState<boolean>(false);
  const [registerTx, setRegisterTx] = useState<string | null>(null);

  //Step State
  const [price, setPrice] = useState<bigint | null>(null);

  const [approvedBalance, setApprovedBalance] = useState<bigint | null>(null);
  const isApproved = price != null && approvedBalance != null && approvedBalance >= price;
  const [balance, setBalance] = useState<bigint | null>(null);
  const hasBalance = price != null && balance != null && balance >= price;

  const [commitmentTime, setCommitmentTime] = useState<number | null>(null);
  const hasCommitment =
    commitmentTime != null && commitmentTime + maxCommitmentAge > new Date().getTime() / 1000;
  const waitProgress = Math.min(
    100,
    (100 * (new Date().getTime() / 1000 - (commitmentTime === null ? 0 : commitmentTime))) / minCommitmentAge
  );
  const waitCompleted =
    commitmentTime != null && commitmentTime + minCommitmentAge < new Date().getTime() / 1000 && hasCommitment;

  const initialized = price != null && approvedBalance != null && balance != null;

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
  }, [activeStep, approvedBalance, balance, commitmentTime]);

  useEffect(() => {
    loadStatusFromChain();
  }, [chainId, address]);

  
  async function updateSteps() {
    var step = 3;

    if (!waitCompleted) {
      step = 2;
    }
    if (!hasCommitment) {
      step = 1;
    }

    if (!isApproved || !hasBalance) {
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
      const receipt = await paymentToken!.approve(
        paymentProvider!.address,
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
      const receipt = await controller!.commit(commitmentHash);
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
      const receipt = await controller!.register(name, address!, duration, secret, {
        value: BigNumber.from(bridgeFee),
      });
      const result = await receipt.wait();

      if (result.status != 1) {
        alert("There was an error, please try again!");
        return;
      }

      ResetSecret();

      if (isMainChain) {
        location.reload();
        return;
      }

      setRegisterTx(receipt.hash);
    } finally {
      setWaitingForTx(false);
    }
  }

  if (!initialized) {
    return (<p>Loading...</p>);
  }

  return (
    <Stepper activeStep={activeStep} orientation="vertical">
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
            Wait 3 Minutes
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
            disabled={waitingForTx || registerTx != null}
            onClick={postRegisterTransaction}
            variant="contained"
          >
            Claim
          </Button>

          {!isMainChain && (
            <Button
              sx={{ m: 2 }}
              disabled={registerTx == null}
              onClick={() => window.open(getTransactionExplorerURL(registerTx == null ? "" : registerTx), "_blank")}
              variant="contained"
            >
              View on AxelarScan
            </Button>
          )}
        </StepContent>
      </Step>
    </Stepper>
  );
};
