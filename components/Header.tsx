import Web3 from "web3";
import Image from "next/image";
import { useState } from "react";

interface Props {
  web3: Web3;
  accounts: string[];
  connect: () => void;
  setCurPage: (page: number) => void;
}

const Header: React.FC<Props> = (props) => {
  const [expanded, setExpanded] = useState(false);

  function truncate(str: string, n: number) {
    return str.length > n ? str.slice(0, n - 1) + "..." : str;
  }

  return (
    <div
      className={
        "absolute z-10 flex h-28 w-full items-center justify-center drop-shadow-lg transition-all ease-in-out sm:h-20 lg:top-2 " +
        (expanded ? "h-40 sm:h-20" : "h-28 sm:h-20")
      }
    >
      <div className="flex h-full w-full flex-wrap items-center justify-around border-[#9D00FF] bg-black bg-opacity-60 px-8 transition-all ease-in-out sm:justify-between lg:w-4/6 lg:rounded-md lg:border-2">
        <a
          href="https://governance-dun.vercel.app/"
          className="relative h-16 w-16"
        >
          <Image alt="logo" src="/logo.png" fill></Image>
        </a>
        <div
          className={
            "sm:text-md flex-row gap-4 text-sm" +
            (expanded
              ? "order-4 mx-4 flex sm:order-none sm:flex"
              : " hidden sm:flex")
          }
        >
          <input
            type="radio"
            name="page"
            id="deposit"
            className="peer/deposit hidden"
            onChange={() => {
              props.setCurPage(0);
            }}
            defaultChecked
          />
          <label
            htmlFor="deposit"
            className="button peer-checked/deposit:bg-[#00008B]"
          >
            Deposit
          </label>
          <input
            type="radio"
            name="page"
            id="propose"
            className="peer/propose hidden"
            onChange={() => {
              props.setCurPage(1);
            }}
          />
          <label
            htmlFor="propose"
            className="button peer-checked/propose:bg-[#00008B]"
          >
            Propose
          </label>
          <input
            type="radio"
            name="page"
            id="vote"
            className="peer/vote hidden"
            onChange={() => {
              props.setCurPage(2);
            }}
          />
          <label
            htmlFor="vote"
            className="button peer-checked/vote:bg-[#00008B]"
          >
            Vote
          </label>
        </div>
        <div>
          {props.accounts.length == 0 ? (
            <div
              className="button"
              onClick={() => {
                props.connect();
              }}
            >
              Connect
            </div>
          ) : (
            <div
              className="button
              "
              onClick={async () => {
                const chainId = 0x89;
                try {
                  await (window as any).ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: props.web3.utils.toHex(chainId) }],
                  });
                } catch (err) {
                  // This error code indicates that the chain has not been added to MetaMask
                  if ((err as any).code === 4902) {
                    await (window as any).ethereum.request({
                      method: "wallet_addEthereumChain",
                      params: [
                        {
                          chainName: "Polygon Mainnet",
                          chainId: props.web3.utils.toHex(chainId),
                          nativeCurrency: {
                            name: "MATIC",
                            decimals: 18,
                            symbol: "MATIC",
                          },
                          rpcUrls: ["https://polygon-rpc.com/"],
                        },
                      ],
                    });
                  }
                }
                props.connect();
              }}
            >
              {truncate(props.accounts[0], 10)}
            </div>
          )}
        </div>
        <div
          className="block h-12 w-12 invert sm:hidden"
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          <img src="/menu.svg" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Header;
