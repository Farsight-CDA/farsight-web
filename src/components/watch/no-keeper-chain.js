export const NoKeeperChainHint = () => {

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "15px" }}>
        <div style={{ width: "100%" }}>
          <h1>Not found!</h1>
          <p>
            We searched everywhere but could not find your keeper chain.
          </p>
          <p>
            This means that it must currently be in a cross-chain transfer.
            If this condition persists you will need to find the transfer in AxelarScan and increase the gas payment.
          </p>
        </div>
        <img width="50%" src="/static/images/flashlight.png"></img>
      </div>
    </>
  );
};
