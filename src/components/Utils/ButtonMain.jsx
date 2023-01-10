export default function ButtonMain(props) {
  return (
    <div className="btn">
      <button
        className="button"
        onClick={() => {
          props.handleClick();
        }}
      >
        {props.label}
      </button>
    </div>
  );
}
