import Image from "next/image";
import React from "react";
import {
  IDKitWidget,
  VerificationLevel,
  ISuccessResult,
} from "@worldcoin/idkit";

function Card({ chain }: any) {
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
    <div aria-label="content" className="mt-9 grid gap-2.5">
      <IDKitWidget
        app_id={process.env.NEXT_PUBLIC_APP_ID as `app_${string}`}
        action={process.env.NEXT_PUBLIC_ACTION_ID as string}
        signal={process.env.NEXT_PUBLIC_SIGNAL}
        verification_level={VerificationLevel.Device}
        handleVerify={verifyProof}
        onSuccess={onSuccess}
      >
        {({ open }) => (
          <button onClick={open}>
            <div className="flex items-center space-x-4 p-3.5 rounded-full bg-teal-800">
              <span className="flex items-center justify-center shrink-0 rounded-full text-black">
                <Image
                  src={"/" + chain.logo}
                  width={40}
                  height={40}
                  alt={chain.name}
                  className="inline mr-10 rounded-full"
                />
              </span>
              <div className="flex flex-col flex-1">
                <h3 className="text-xl font-medium text-white bold">
                  {chain.name}
                </h3>
                <div className="divide-x divide-gray-200 mt-auto">
                  <span className="inline-block px-3 text-sm leading-none text-gray-200 font-normal first:pl-0">
                    Available
                  </span>
                  <span className="inline-block px-3 text-xs leading-none text-gray-400 font-normal first:pl-0"></span>
                </div>
              </div>
            </div>
          </button>
        )}
      </IDKitWidget>
    </div>
  );
}

export default Card;
