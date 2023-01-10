
export default function UsrBox(props) {

  return (
    <>
      {props.deletePage ? (
        <div className="usrBox">
          <p>Clear Selection</p>
        </div>
      ) : (
        <div className="usrBox">
          <h4>{props.title}</h4>
          <p>{props.stats}</p>
          <h6>{props.time}</h6>
        </div>
      )}
    </>
  );
}
