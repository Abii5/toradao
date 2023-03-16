import { useEffect, useState } from "react";
import Web3 from "web3";

import govtabi from "@/public/govtabi.json";
import config from "@/public/config.json";

interface Props {
  accounts: string[];
  web3: Web3;
}

const WithdrawBox: React.FC<Props> = (props) => {
  const [amount, setAmount] = useState<number>(0);
  const govtcontract = new props.web3.eth.Contract(
    govtabi as any,
    config.daoAddress
  );

  async function withdraw(amount: number) {
    await govtcontract.methods["withdraw()"]().send({
      from: props.accounts[0],
    });
  }
  async function withdrawableAmount() {
    if (props.accounts[0] != undefined) {
      const _withdrawableAmount = await govtcontract.methods[
        "returnWithdrawableAmount()"
      ]().call({
        from: props.accounts[0],
      });
      setAmount(_withdrawableAmount / 10 ** 18);
      // console.log(_withdrawableAmount);
    }
  }

  useEffect(() => {
    withdrawableAmount();
  }, [props.accounts]);
  return (
    <div className="box">
      {props.accounts.length > 0 ? (
        <div className="flex h-full w-full flex-col justify-between">
          <div className="flex flex-col gap-2">
            <div className="text-xl font-semibold">Withdraw</div>
            <p>
              If you have already deposited, you can withdraw your deposit.{" "}
              <br /> <br />
              <b>Heads up! </b> You cannot deposit if you haven't withdrawn your
              earlier deposit. Your wallet provider might throw an error and
              your deposit may be lost.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <p>
              You currently have <b>{amount}</b> tokens to withdraw.
            </p>
            <button
              onClick={() => {
                withdraw(amount);
              }}
              className="button"
            >
              Withdraw
            </button>
          </div>
        </div>
      ) : (
        <div className="text-xl font-semibold">You have to connect first</div>
      )}
    </div>
  );
};

export default WithdrawBox;
