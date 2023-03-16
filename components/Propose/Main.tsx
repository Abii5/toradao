import Previous from "./Previous";
import Propose from "./Propose";

import Web3 from "web3";

interface Props {
  accounts: string[];
  web3: Web3;
}

const Proposals: React.FC<Props> = (props) => {
  return (
    <div className="flex md:flex-row flex-col gap-8 pb-36">
      <Propose accounts={props.accounts} web3={props.web3}></Propose>
      <Previous accounts={props.accounts} web3={props.web3}></Previous>
    </div>
  );
};

export default Proposals;
