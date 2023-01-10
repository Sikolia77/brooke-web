import UsrBox from "./UsrBox";

export default function UsrStats(props) {
  let time = props.time ? props.time : "NULL";
  let total = props.stats ? props.stats.total : "0";
  let categories = props.stats ? props.stats.categories : "0";
  let active = props.stats ? props.stats.active : "0";
  return (
    <div className="usrStats">
      <UsrBox title="Total" stats={total} time={time} />
      <UsrBox title="Categories" stats={categories} time={time} />
      <UsrBox title="Active" stats={active} time={time} />
    </div>
  );
}
