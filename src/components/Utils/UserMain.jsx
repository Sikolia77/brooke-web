import { useState } from "react"

export default function UserMain(props) {
    const [id,setId] = useState(props.UserID)
    const status = (props.status === true) ? 'Disable' : 'Activate'


    return <tr>
        <td>{props.name}</td>
        <td className="email">{props.email}</td>
        <td>{props.role}</td>
        <td><button className="disable" onClick={() => {
            if (props.status)
                props.onUpdate(false, id)
            else props.onUpdate(true, id)
        }}>{status}</button></td>
        <td><button className="delete" onClick={() => { props.onDelete(id) }}>Delete</button></td>
    </tr >


}