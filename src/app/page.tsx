"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Card from "./components/Card";
import { ethers } from "ethers";

const chains = [
  {
    name: "Arbitrum",
    contract: "",
    logo: "Arbitrum.jpg",
  },
];

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      <Image src="/dewdrop.png" width={200} height={100} alt="logo" />
      <div className="flex items-center justify-center mt-10">
        <div
          aria-label="card"
          className="p-8 rounded-3xl bg-white max-w-sm w-full"
        >
          <div aria-label="header" className="flex items-center space-x-2">
            <div className="space-y-0.5 flex-1">
              <h3 className="font-medium text-lg tracking-tight text-gray-900 leading-tight">
                Claim tokens using proof of personhood
              </h3>
            </div>
            <a
              href="/"
              className="inline-flex items-center shrink-0 justify-center w-8 h-8 rounded-full text-white bg-gray-900 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M17 7l-10 10"></path>
                <path d="M8 7l9 0l0 9"></path>
              </svg>
            </a>
          </div>
          {chains.map((chain) => (
            <Card chain={chain} />
          ))}
        </div>
      </div>
    </main>
  );
}
