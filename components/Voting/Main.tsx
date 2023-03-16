import Previous from "./Previous";
import Winner from "./Winner";

import React from "react";
import Web3 from "web3";
import govtabi from "@/public/govtabi.json";
import config from "@/public/config.json";

import { useState, useEffect } from "react";

interface Props {
  accounts: string[];
  web3: Web3;
}

const Voting: React.FC<Props> = (props) => {
  const [allProposals, setAllProposals] = useState<Array<any>>([]);
  const [winners, setWinners] = useState<Array<any>>([]);
  const [ifSecond, setIfSecond] = useState<boolean>(false);

  const govtcontract = new props.web3.eth.Contract(
    govtabi as any,
    config.daoAddress
  );

  async function getIfSecondRound() {
    if (props.accounts[0] != undefined) {
      const _ifSecond = await govtcontract.methods[
        "getIsSecondRound()"
      ]().call();
      setIfSecond(_ifSecond);
    }
  }

  async function returnWinners() {
    if (props.accounts[0] != undefined) {
      const _winners = await govtcontract.methods["returnWinners()"]().call();
      setWinners(_winners);
    }
  }

  async function returnAllProposals() {
    console.log(props.accounts[0]);
    if (props.accounts[0] != undefined) {
      const _allProposals = await govtcontract.methods[
        "returnAllProposals()"
      ]().call();
      setAllProposals(_allProposals);
    }
  }

  useEffect(() => {
    returnAllProposals();
    returnWinners();
    getIfSecondRound();
  }, [props.accounts]);

  return (
    <div className="flex flex-col gap-8 pb-36 md:flex-row">
      <Previous
        accounts={props.accounts}
        web3={props.web3}
        allProposals={allProposals}
        isSecondRound={ifSecond}
      ></Previous>
      <Winner
        accounts={props.accounts}
        web3={props.web3}
        winners={winners}
      ></Winner>
    </div>
  );
};

export default Voting;
