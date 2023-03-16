interface Props {
  proposal: any;
  accounts: string[];
}

const PrevBox: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-col text-center justify-center bg-gray-400 min-h-[6rem] rounded-md drop-shadow-xl py-3 px-4 gap-1 w-full">
      <div className="flex flex-row text-sm gap-1 text-start">
        Proposal: <b>{props.proposal.proposal}</b>
      </div>
      <div className="flex flex-row text-sm gap-1">
        Votes: <b>{props.proposal.votes}</b>
      </div>
      <div className="flex flex-row text-sm gap-1">
        ID: <b>{props.proposal.id}</b>
      </div>
      <div className="flex flex-col text-start text-sm">
        Proposed On: <b>{new Date(props.proposal.time * 1000).toUTCString()}</b>
      </div>
      <div className="flex flex-row items-center gap-2 text-start text-sm">
        Status:{" "}
        {props.proposal.isPassed ? (
          <p className="bg-green-400 text-green-900 rounded-md py-1 px-3 font-bold">Passed</p>
        ) : (
          <p className="bg-red-300 text-red-900 rounded-md py-1 px-3 font-bold w-fit">
            Voting or Lost
          </p>
        )}
      </div>
    </div>
  );
};

export default PrevBox;
