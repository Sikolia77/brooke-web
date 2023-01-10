import { useState } from "react"

export default function DataItem(props) {
    const [id,setId] = useState(props.ID)
    //const status = (props.status === true) ? 'Disable' : 'Activate'


    return <tr>
        <td>{props.thumbnail}</td>
        <td className="email">{props.title}</td>
        <td>{props.category}</td>
        <td>{props.description}</td>
        {/* <td><button className="disable" onClick={() => {
            if (props.status)
                props.onUpdate(false, id)
            else props.onUpdate(true, id)
        }}>{status}</button></td> */}
        <td><button className="delete" onClick={() => { props.onDelete(id) }}>Delete</button></td>
    </tr >


}