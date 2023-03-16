import { useState } from "react";
import Web3 from "web3";
import coinabi from "@/public/coinabi.json";
import govtabi from "@/public/govtabi.json";
import DepositBox from "./Deposit";
import WithdrawBox from "./Withdraw";

interface Props {
  accounts: string[];
  web3: Web3;
}

const Deposit: React.FC<Props> = (props) => {
  return (
    <div className="flex md:flex-row flex-col gap-8 h-fit pb-36">
      <DepositBox web3={props.web3} accounts={props.accounts} />
      <WithdrawBox web3={props.web3} accounts={props.accounts} />
    </div>
  );
};

export default Deposit;
