import React, { useEffect, useState } from "react";
import PrevBox from "./PrevBox";
import Web3 from "web3";

interface Props {
  accounts: string[];
  web3: Web3;
  allProposals: Array<any>;
  isSecondRound: boolean;
}

const Previous: React.FC<Props> = (props) => {
  console.log(props.isSecondRound);
  return (
    <div className="box">
      {props.accounts.length > 0 ? (
        <div className="flex h-full w-full flex-col justify-evenly">
          <div className="flex flex-col gap-2">
            <div className="text-xl font-semibold">Proposals</div>
            <p>You can vote for proposals here</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            {!props.isSecondRound
              ? props.allProposals.map((proposal, idx) => (
                  <PrevBox
                    proposal={proposal}
                    web3={props.web3}
                    accounts={props.accounts}
                    isWinner={0}
                    key={idx}
                  />
                ))
              : props.allProposals
                  .sort((a, b) => b.voteCount - a.voteCount)
                  .reverse()
                  .slice(0, 9)
                  .map((proposal, idx) => (
                    <PrevBox
                      proposal={proposal}
                      web3={props.web3}
                      accounts={props.accounts}
                      isWinner={1}
                      key={idx}
                    />
                  ))}

            {props.allProposals.length === 0 && (
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

export default Previous;
