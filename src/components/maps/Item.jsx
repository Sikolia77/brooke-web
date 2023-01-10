export default function Item(props) {
  
    const color = props.active === props.txt ? "#74465C" : "#030092";
  
    return (
    <h4 style={{color:color}}
      onClick={() => {
        props.toggle(props.id);
      }}
    >
      {props.txt}
    </h4>
  );
}
