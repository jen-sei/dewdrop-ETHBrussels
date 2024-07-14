import { type IVerifyResponse, verifyCloudProof } from "@worldcoin/idkit";
import { CHAIN } from "@/app/chains";
import { ethers } from "ethers";

import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

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
    return {
      success: false,
      message: "Recipient address and proof are required.",
    };
  }

  try {
    // Check if the proof has been used
    const isProofUsed = await faucetContract.usedProofs(proof);
    if (isProofUsed) {
      return {
        success: false,
        message: "Faucet can only be claimed once.",
      };
    }

    const tx = await faucetContract.requestFunds(recipient, proof);
    await tx.wait();
    return {
      success: true,
      message: "Transaction complete!",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { proof, recipient } = req.body;
  const app_id = process.env.NEXT_PUBLIC_APP_ID as `app_${string}`;
  const action = process.env.NEXT_PUBLIC_ACTION_ID as string;
  const signal = process.env.NEXT_PUBLIC_SIGNAL as string;
  const verifyRes = (await verifyCloudProof(
    proof,
    app_id,
    action,
    signal
  )) as IVerifyResponse;

  if (verifyRes.success) {
    const dripRes = await drip(proof.proof, CHAIN.ARBITRUM, recipient);
    const statusCode = dripRes.success ? 200 : 500;
    res.status(statusCode).json({ message: dripRes.message });
  } else {
    res.status(500).json({
      message: verifyRes.detail || "Worldcoin verification has failed.",
    });
  }
}
