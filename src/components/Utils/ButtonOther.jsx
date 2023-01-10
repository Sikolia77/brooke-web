export default function ButtonOther(props) {
  return (
    <div className="buttonother">
      <button onClick={()=>{props.handleClick()}}>{props.label}</button>
    </div>
  );
}