import { useState, useEffect } from "react";
import Web3 from "web3";

import coinabi from "@/public/coinabi.json";
import govtabi from "@/public/govtabi.json";
import config from "@/public/config.json";

interface Props {
  accounts: string[];
  web3: Web3;
}

const DepositBox: React.FC<Props> = (props) => {
  const [amount, setAmount] = useState<number>(0);

  const [maxAmt, setMaxAmt] = useState<number>(0);
  const [minAmt, setMinAmt] = useState<number>(0);

  const govtcontract = new props.web3.eth.Contract(
    govtabi as any,
    config.daoAddress
  );

  const coincontract = new props.web3.eth.Contract(
    coinabi as any,
    config.coinAddress
  );

  useEffect(() => {
    govtcontract.methods.getMinimumDeposit().call().then((result: any) => {
      setMinAmt(result);
      setAmount(result);
    });
  })

  async function deposit(amount: any) {
    if (
      confirm(
        "Are you sure you want to deposit? You cannot propose until 14 days later! If you choose to withdraw prior, you will not be able to propose!"
      ) == false
    ) {
      return;
    }

    const account = await props.web3.eth.getAccounts();
    const allowance = await coincontract.methods.allowance(account[0], config.daoAddress).call();
    if (+allowance < +amount) {
      alert("You did not approve tokens to deposit.");
      return;
    }

    try {
      const _gasPrice = await props.web3.utils.toWei("35", "gwei");

      await govtcontract.methods["deposit(uint256)"](amount).send({
        from: props.accounts[0],
        gasPrice: _gasPrice,
        gas: 2000000,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async function approve(amount: BigInt) {
    await coincontract.methods["approve(address,uint256)"](
      config.daoAddress,
      amount
    ).send({
      from: props.accounts[0],
    });
  }

  return (
    <div className="box">
      {props.accounts.length > 0 ? (
        <div className="flex h-full w-full flex-col justify-between">
          <div className="flex flex-col gap-2">
            <div className="text-xl font-semibold">Deposit</div>
            <p>
              In order to make or vote proposals, you have to deposit and wait for a while first.{" "}
              <br />
              <br />
              You will get 2 transactions, one for approval and one for deposit.
              <br />
              <br />
              {/* <div>Minimum Deposit is {(minAmt / 10 ** 18).toFixed(2)}TORA</div>
              <div>Maximum Deposit is {(maxAmt / 10 ** 18).toFixed(2)}TORA</div> */}
              <div>Current Deposit is {(minAmt / 10 ** 18).toFixed(2)}TORA</div>
            </p>{" "}
          </div>

          <div className="flex flex-col items-center gap-4">
            {/* <input
              type="number"
              name=""
              id=""
              placeholder="Enter the amount"
              className="w-full rounded-md border-2 border-[#9D00FF] bg-indigo-100 py-2 px-4"
              onChange={(e) => {
                setAmount(parseInt(e.target.value));
              }}
            /> */}
            <div className="flex w-full flex-row items-center justify-center gap-2">
              <button
                onClick={() => {
                  approve(BigInt(amount));
                }}
                className="button">
                Approve
              </button>
              <button
                onClick={() => {
                  deposit(amount);
                }}
                className="button">
                Deposit
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-xl font-semibold">You have to connect first</div>
      )}
    </div>
  );
};

export default DepositBox;
