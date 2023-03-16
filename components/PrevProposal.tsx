import React from "react";
import Web3 from "web3";
import govtabi from "@/public/govtabi.json";
import config from "@/public/config.json";

interface Props {
  proposal: any;
  web3: Web3;
  accounts: string[];
  isWinner: number;
}

const PrevProposal: React.FC<Props> = (props) => {
  function truncate(str: string, n: number) {
    return str.length > n ? str.slice(0, n - 1) + "..." : str;
  }

  return (
    <div className="flex min-h-[6rem] w-full flex-col  justify-center gap-1 rounded-md bg-transparent py-3 px-4 text-center drop-shadow-xl">
      <div className="flex flex-row gap-1 text-sm">
        Sent by: <b>{truncate(props.proposal.proposer, 10)}</b>
      </div>
      <div className="flex flex-row gap-1 text-start text-sm">
        Proposal: <b>{props.proposal.proposal}</b>
      </div>
      <div className="flex flex-row gap-1 text-sm">
        Votes: <b>{props.proposal.votes}</b>
      </div>
      <div className="flex flex-row gap-1 text-sm">
        ID: <b>{props.proposal.id}</b>
      </div>
      <div className="flex flex-col text-start text-sm">
        Proposed On: <b>{new Date(props.proposal.time * 1000).toUTCString()}</b>
      </div>
      <div className="flex flex-row items-center gap-2 text-start text-sm">
        Status:{" "}
        {props.isWinner == 0 && (
          <p className="w-fit rounded-md bg-red-300 py-1 px-3 font-bold text-red-900">
            Voting or Lost
          </p>
        )}
        {props.isWinner == 1 && (
          <p className="w-fit rounded-md bg-yellow-300 py-1 px-3 font-bold text-yellow-900">
            Second Round
          </p>
        )}
        {props.isWinner == 2 && (
          <p className="rounded-md bg-green-400 py-1 px-3 font-bold text-green-900">
            Passed
          </p>
        )}
      </div>
    </div>
  );
};

export default PrevProposal;
