export default function ButtonRegister(props) {
    
    return <div>
        <div className="buttonRegister">
            <button onClick={()=>{props.handleClick()}}>{props.label}</button>
        </div>
    </div>
}