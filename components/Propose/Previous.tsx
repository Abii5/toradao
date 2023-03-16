import React, { useEffect, useState } from "react";
import govtabi from "@/public/govtabi.json";
import config from "@/public/config.json";
import Web3 from "web3";
import PrevBox from "./PrevBox";

interface Props {
  accounts: string[];
  web3: Web3;
}

const Previous: React.FC<Props> = (props) => {
  const [allProposals, setAllProposals] = useState<Array<any>>([]);

  const govtcontract = new props.web3.eth.Contract(
    govtabi as any,
    config.daoAddress
  );

  async function returnAllProposals() {
    console.log(props.accounts[0]);
    if (props.accounts[0] != undefined) {
      const _allProposals = await govtcontract.methods[
        "returnAllProposals()"
      ]().call({
        from: props.accounts[0],
      });
      setAllProposals(_allProposals);
      console.log(_allProposals);
    }
  }

  useEffect(() => {
    returnAllProposals();
  }, [props.accounts]);

  return (
    <div className="box">
      {props.accounts.length > 0 ? (
        <div className="flex h-full w-full flex-col justify-evenly">
          <div className="flex flex-col gap-2">
            <div className="text-xl font-semibold">Previous Proposals</div>
            <p>You can see your previous proposals here</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            {allProposals
              .filter((item) => item.proposer == props.accounts[0])
              .map((proposal, idx) => (
                <PrevBox
                  proposal={proposal}
                  accounts={props.accounts}
                  key={idx}
                />
              ))}
            {allProposals.length === 0 && (
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
