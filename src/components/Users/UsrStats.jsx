import UsrBox from "./UsrBox";

export default function UsrStats(props) {
  return (
    <div className="usrStats">
      <UsrBox title="Total" stats={props.total} time={props.time} />
      <UsrBox title="Active" stats={props.active} time={props.time} />
      <UsrBox title="Inactive" stats={props.inactive} time={props.time} />
    </div>
  );
}
