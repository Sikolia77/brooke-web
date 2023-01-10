export default function Box(props){

    return <div className="box" 
    onClick={() => {
          window.location.href = "/map";
        }}
    >
         <img src={props.img}></img>
                <p>{props.title}</p>
            </div>
}