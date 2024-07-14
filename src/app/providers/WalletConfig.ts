import { http, createConfig } from "wagmi";
import { base, mainnet, optimism } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT || "";

export const config = createConfig({
  chains: [mainnet, base],
  connectors: [walletConnect({ projectId })],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});
