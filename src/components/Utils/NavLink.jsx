
import iconWhite from "../../assets/imgs/icon-white.png"
import iconAccent from "../../assets/imgs/icon-accent.png";

export default function NavLink(props) {
  
  const icon = props.active === props.txt ? iconAccent : iconWhite
  const color = props.active === props.txt ? "#00b32a" : "#FFFFFF";
  
  return (
    <div className="Utils">
      <div onClick={()=>{
        if(props.url)
          window.location.href= props.url
        if (props.url2) window.open(props.url2, "_blank")
      }} className="NavLink">
        <img src={icon} alt="" />
        <p style={{color:color}}>{props.txt}</p>
      </div>
    </div>
  );
}