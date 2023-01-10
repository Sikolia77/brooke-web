export default function AlertMsg(props) {
  return (
    <div className="model">
      <div className="alert">
        <p>{props.msg}</p>
        <h4 onClick={()=>{props.setMsg(null)}}>Okay</h4>
      </div>
    </div>
  );
}
