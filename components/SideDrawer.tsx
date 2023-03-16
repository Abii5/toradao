import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Web3 from "web3";
import { AiOutlineMenuUnfold, AiOutlineClose } from "react-icons/ai";

interface Props {
  web3: Web3;
  accounts: string[];
  connect: () => void;
  setCurPage: (page: number) => void;
}

const SideDrawer: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false);

  function truncate(str: string, n: number) {
    return str.length > n ? str.slice(0, 4) + "..." + str.slice(-4) : str;
  }
  return (
    <>
      <aside
        className={`${
          open ? "flex" : "hidden"
        } absolute  left-0 z-20 h-screen w-64 flex-col overflow-y-visible  border-r bg-sidebar px-5 py-8  rtl:border-r-0 rtl:border-l dark:border-gray-700 dark:bg-sidebar lg:flex`}
      >
        <div className="block lg:hidden" onClick={() => setOpen(false)}>
          <AiOutlineClose className="text-2xl text-white" />
        </div>
        <Link href="/" className="w-full">
          <Image
            className="mx-auto h-1/2 w-auto"
            width="400"
            height={100}
            src="/logo.png"
            alt=""
          />
        </Link>
        <div className="relative -top-28 flex flex-1 flex-col justify-between lg:-top-10">
          <nav className="-mx-3 space-y-6 ">
            <div className="space-y-3 ">
              <a
                className="flex transform cursor-pointer items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                // href="#"
                onClick={() => {
                  setOpen(false);
                  props.setCurPage(0);
                }}
              >
                <span className="mx-2 text-xl font-medium">Deposit</span>
              </a>
              <a
                className="flex transform cursor-pointer items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                // href="#"
                onClick={() => {
                  setOpen(false);
                  props.setCurPage(1);
                }}
              >
                <span className="mx-2 text-xl font-medium">Propose</span>
              </a>
              <a
                className="flex transform cursor-pointer items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                // href="#"
                onClick={() => {
                  setOpen(false);
                  props.setCurPage(2);
                }}
              >
                <span className="mx-2 text-xl font-medium">Live Propose</span>
              </a>
              <a
                className="flex transform cursor-pointer items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                // href="#"
                onClick={() => {
                  setOpen(false);
                  props.setCurPage(3);
                }}
              >
                <span className="mx-2 text-xl font-medium ">Vote</span>
              </a>

              <div>
                {props.accounts.length == 0 ? (
                  <div
                    className="button ml-3 mt-4 w-max"
                    onClick={() => {
                      props.connect();
                    }}
                  >
                    Connect
                  </div>
                ) : (
                  <div
                    className="button ml-3 mt-4 w-max"
                    onClick={async () => {
                      const chainId = 0x89;
                      try {
                        await (window as any).ethereum.request({
                          method: "wallet_switchEthereumChain",
                          params: [
                            { chainId: props.web3.utils.toHex(chainId) },
                          ],
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
                    {truncate(props.accounts[0], 5)}
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
        <Image
          className="absolute -right-24 bottom-0 z-40"
          width="500"
          height="700"
          src="/sideTiger.png"
          alt=""
        />
      </aside>
      <div
        className="fixed z-10 block w-full py-1 pl-4 backdrop-blur lg:hidden"
        onClick={() => {
          setOpen(true);
        }}
      >
        <AiOutlineMenuUnfold className="text-4xl text-white" />
      </div>
    </>
  );
};

export default SideDrawer;
