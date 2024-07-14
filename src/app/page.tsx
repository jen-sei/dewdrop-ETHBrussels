"use client";
import {
  IDKitWidget,
  VerificationLevel,
  ISuccessResult,
} from "@worldcoin/idkit";
import { Web3ModalProvider } from "./providers/Web3Modal";
import ConnectWallet from "./providers/ConnectWallet";

export default function Home() {
  const verifyProof = async (proof: ISuccessResult) => {
    try {
      const res = await fetch("/api/drip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proof,
          recipient: "0x3897172a62e24ba3804a9d805ae14ad8c1a2bfdd",
        }),
      });

      if (!res.ok) {
        // Handle non-200 responses
        const errorData = await res.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const data = await res.json();
    } catch (error) {
      throw new Error(error.message || "Unable to verify");
    }
  };

  const onSuccess = () => {
    console.log("Success");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Web3ModalProvider>
        <ConnectWallet />
        <IDKitWidget
          app_id={process.env.NEXT_PUBLIC_APP_ID as `app_${string}`}
          action={process.env.NEXT_PUBLIC_ACTION_ID as string}
          signal={process.env.NEXT_PUBLIC_SIGNAL}
          verification_level={VerificationLevel.Device}
          handleVerify={verifyProof}
          onSuccess={onSuccess}
        >
          {({ open }) => <button onClick={open}>Verify with World ID</button>}
        </IDKitWidget>
      </Web3ModalProvider>
    </main>
  );
}
