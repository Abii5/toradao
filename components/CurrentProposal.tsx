import React, { useEffect, useState } from "react";
import PrevBox from "./PrevProposal";
import Web3 from "web3";
import govtabi from "@/public/govtabi.json";
import config from "@/public/config.json";

interface Props {
  accounts: string[];
  web3: Web3;
}

const SideDrawer: React.FC<Props> = (props) => {
  const govtcontract = new props.web3.eth.Contract(
    govtabi as any,
    config.daoAddress
  );
  const [proposals, setProposals] = useState<Array<any>>([]);
  const [isSecondRound, setIsSecondRound] = useState<boolean>(false);

  async function getIfSecondRound() {
    if (props.accounts[0] != undefined) {
      const _ifSecond = await govtcontract.methods[
        "getIsSecondRound()"
      ]().call();
      setIsSecondRound(_ifSecond);
    }
  }

  async function returnAllProposals() {
    console.log(props.accounts[0]);
    if (props.accounts[0] != undefined) {
      const _allProposals = await govtcontract.methods[
        "returnAllProposals()"
      ]().call();
      setProposals(_allProposals);
    }
  }

  useEffect(() => {
    getIfSecondRound();
    returnAllProposals();
  }, []);

  return (
    <div className="box">
      {props.accounts.length > 0 ? (
        <div className="flex h-full w-full flex-col justify-evenly">
          <div className="flex flex-col gap-2">
            <div className="text-xl font-semibold">Ongoing Proposals</div>
            <p>Current proposals here</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            {isSecondRound
              ? proposals.map((proposal, idx) => (
                  <PrevBox
                    proposal={proposal}
                    web3={props.web3}
                    accounts={props.accounts}
                    isWinner={0}
                    key={idx}
                  />
                  // .sort((a, b) => b.voteCount - a.voteCount)
                  // .reverse()
                  // .slice(0, 9)
                ))
              : proposals.map((proposal, idx) => (
                  <PrevBox
                    proposal={proposal}
                    web3={props.web3}
                    accounts={props.accounts}
                    isWinner={1}
                    key={idx}
                  />
                ))}

            {proposals.length === 0 && (
              <div className="text-xl font-semibold">No proposals yet</div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-xl font-semibold">You have to connect first</div>
      )}
    </div>
  );
};

export default SideDrawer;
