import React from "react";
import Web3 from "web3";
import { useState } from "react";

import Deposit from "@/components/Deposit/Main";
import Proposals from "@/components/Propose/Main";
import Voting from "@/components/Voting/Main";
import CurrentProposal from "@/components/CurrentProposal";

interface Props {
  web3: Web3;
  curPage: number;
  accounts: string[];
}

export default function Home(props: Props) {
  return (
    <div className="box-border  flex h-screen items-center justify-center overflow-y-scroll bg-yellowbg bg-cover bg-center pt-36 text-white sm:pt-28">
      <div className=" h-full items-center">
        {props.curPage == 0 && (
          <Deposit accounts={props.accounts} web3={props.web3} />
        )}
        {props.curPage == 1 && (
          <Proposals accounts={props.accounts} web3={props.web3}></Proposals>
        )}
        {props.curPage == 2 && (
          <CurrentProposal accounts={props.accounts} web3={props.web3} />
        )}
        {props.curPage == 3 && (
          <Voting accounts={props.accounts} web3={props.web3}></Voting>
        )}
      </div>
    </div>
  );
}
