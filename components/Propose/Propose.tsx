/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Web3 from "web3";
import { useEffect, useState } from "react";

import govtabi from "@/public/govtabi.json";
import coinabi from "@/public/coinabi.json";
import config from "@/public/config.json";

interface Props {
  accounts: string[];
  web3: Web3;
}

const Propose: React.FC<Props> = (props) => {
  const [propTime, setPropTime] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [deposit, setDeposit] = useState<Array<any>>([]);

  const fee: number = 50000 * 10 ** 18;

  const [agenda, setAgenda] = useState<string>("");

  const [proposal, setProposal] = useState<string>("");

  const govtcontract = new props.web3.eth.Contract(
    govtabi as any,
    config.daoAddress
  );
  const coincontract = new props.web3.eth.Contract(
    coinabi as any,
    config.coinAddress
  );

  const setter = async () => {
    if (props.accounts[0] != undefined) {
      const _deposit = await govtcontract.methods["getDeposit()"]().call({
        from: props.accounts[0],
      });
      setDeposit(_deposit);

      const time1 = await govtcontract.methods.getProposalTime().call();
      setPropTime(time1);
      const time2 = await govtcontract.methods
        .getTimeLeftToPropose()
        .call({ from: props.accounts[0] });
      setTimeLeft(time2);

      // set the agenda item
      const _agendaItem = await govtcontract.methods[
        "getCurrentAgenda"
      ]().call();
      setAgenda(_agendaItem);
    }
  };

  useEffect(() => {
    setter();
  }, [props.accounts]);

  function proposeMessage(message: string) {
    try {
      // coincontract.methods
      //   .transfer("0xbF3a443bd5bd3Ab5Cf8E79d65b8e47345477110a", BigInt(fee))
      //   .call({ from: props.accounts[0] });
      govtcontract.methods["propose(string)"](message).send({
        from: props.accounts[0],
      });
    } catch (e) {
      console.log(e);
      return;
    }
  }
  return (
    <div className="box">
      {props.accounts.length > 0 && deposit[0] != 0 ? (
        <div className="flex h-full w-full flex-col justify-evenly">
          <div className="flex flex-col gap-2">
            <div className="text-xl font-semibold">Propose</div>
            <div>
              Be sure that enough time has passed since your last deposit.
            </div>
            <div>
              Currently, <b>{(propTime / 60 / 60 / 24).toFixed(2)}</b> days must
              pass after every deposit. <br />
              {/* The fee for depositing is {(fee / 10 ** 18).toFixed(2)} */}
            </div>
            <div>
              {timeLeft / 60 / 60 / 24 > 0 && (
                <>
                  You have <b>{(timeLeft / 60 / 60 / 24).toFixed(2)}</b> days
                  left to propose.
                </>
              )}
              {timeLeft / 60 / 60 / 24 <= 0 && <>You can now propose!</>}
            </div>
          </div>

          {timeLeft / 60 / 60 / 24 <= 0 && (
            <div className="flex flex-col items-center gap-4">
              <div>
                <span className="font-bold">Current Agenda Item:</span> {agenda}
              </div>
              <textarea
                name="proposal"
                id="proposal"
                cols={30}
                rows={10}
                placeholder="Write your proposal here"
                className="max-h-24 w-full rounded-md border-2 border-[#9D00FF] bg-indigo-100 p-2 text-sm placeholder:text-black"
                onChange={(e) => {
                  setProposal(e.target.value);
                  console.log(proposal);
                }}
              ></textarea>
              <button
                className="button"
                onClick={() => {
                  proposeMessage(proposal);
                }}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="text-xl font-semibold">
            You have to connect first.
          </div>
          <div>
            If you are connected, you might not have deposited yet. If this part
            still does not load, try reloading the page.
          </div>
        </div>
      )}
    </div>
  );
};

export default Propose;
