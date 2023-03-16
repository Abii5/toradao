import Web3 from "web3";
import PrevBox from "./PrevBox";

interface Props {
  accounts: string[];
  web3: Web3;
  winners: Array<any>;
}

const Winner: React.FC<Props> = (props) => {
  return (
    <div className="box">
      {props.accounts.length > 0 ? (
        <div className="flex flex-col h-full w-full justify-evenly">
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-xl">Winners</div>
            <div>Winners of every vote, selected by the admin, is displayed here</div>
          </div>
          <div className="flex flex-col items-center gap-4">
            {props.winners.map((winner, idx) => (
              <PrevBox
                proposal={winner}
                web3={props.web3}
                accounts={props.accounts}
                isWinner={2}
                key={idx}
              />
            ))}
            {props.winners.length === 0 && (
              <div className="font-semibold text-xl">No winners yet</div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="font-semibold text-xl">You have to connect first.</div>
        </div>
      )}
    </div>
  );
};

export default Winner;
