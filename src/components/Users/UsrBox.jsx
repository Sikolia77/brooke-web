export default function UsrBox(props) {
  return (
    <div className="usrBox">
      <h4>{props.title}</h4>
      <p>{props.stats}</p>
      <h6>{props.time}</h6>
    </div>
  );
}
