// "use server";
import {
  type IVerifyResponse,
  verifyCloudProof,
  ISuccessResult,
} from "@worldcoin/idkit";
import { CHAIN } from "../chains";
import { ethers, SigningKey } from "ethers";

// Updated ABI of your MainnetFaucet contract
const FAUCET_ABI = [
  "function requestFunds(address recipient, string calldata proof) external",
  "function withdraw() external",
  "function changeFaucetAmount(uint256 newAmount) external",
  "function faucetAmount() view returns (uint256)",
  "function usedProofs(string) view returns (bool)",
];

/* This server function drips tokens from this faucet.
 * @param {proof} The zero knowledge proof from world coin.
 * @param {chain} The chain to send the funds to.
 */
export async function verify_(
  proof: ISuccessResult,
  chain: CHAIN,
  recipient: string
) {
  const app_id = process.env.NEXT_PUBLIC_APP_ID as `app_${string}`;
  const action = process.env.NEXT_PUBLIC_ACTION_ID as string;
  const signal = process.env.NEXT_PUBLIC_SIGNAL as string;
  const verifyRes = (await verifyCloudProof(
    proof,
    app_id,
    action,
    signal
  )) as IVerifyResponse;

  //   if (verifyRes.success) {
  //     await drip(proof.proof + "1", CHAIN.ARBITRUM, recipient);
  //     return { success: true };
  //   } else {
  //     throw new Error("Worldcoin verification failed. Please try again.");
  //     // This is where you should handle errors from the World ID /verify endpoint.
  //     // Usually these errors are due to a user having already verified.
  //   }
}

export async function verify(
  proof: ISuccessResult,
  chain: CHAIN,
  recipient: string
) {
  const app_id = process.env.NEXT_PUBLIC_APP_ID as `app_${string}`;
  const action = process.env.NEXT_PUBLIC_ACTION_ID as string;
  const signal = process.env.NEXT_PUBLIC_SIGNAL as string;

  const response = await fetch(
    `https://developer.worldcoin.org/api/v1/verify/${app_id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...proof, action }),
    }
  );

  console.log(response);
  if (response.ok) {
    const { verified } = await response.json();
    await drip(proof.proof + "1", chain, recipient);
    return verified;
  } else {
    const { code, detail } = await response.json();
    throw new Error(`Error Code ${code}: ${detail}`);
  }
}

export async function drip(proof: string, chain: CHAIN, recipient: string) {
  const provider = new ethers.JsonRpcProvider(
    "https://public.stackup.sh/api/v1/node/arbitrum-sepolia"
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contractAddress = "0x987aAc1F90e05bE65F450339228d357638f87284";

  const faucetContract = new ethers.Contract(
    contractAddress,
    FAUCET_ABI,
    wallet
  );

  if (!recipient || !proof) {
    throw new Error("Recipient address and proof are required.");
  }

  try {
    // Check if the proof has been used
    const isProofUsed = await faucetContract.usedProofs(proof);
    if (isProofUsed) {
      throw new Error("Faucet can only be claimed once.");
    }

    const tx = await faucetContract.requestFunds(recipient, proof);
    await tx.wait();
  } catch (error) {
    throw new Error(`ERROR: ${error.message}`);
  }
}
