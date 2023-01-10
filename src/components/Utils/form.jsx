import { useRef, useState } from "react";
import Button from "./ButtonMain";
const Form = (props) => {
  const [setApiMessage] = useState(null);
  const form = useRef(null);

  const [disclaimer, setDisclaimer] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  //const [Name, setName] = useState("")


  const createUser = (e) => {
    e.preventDefault();
    //const data = new FormData(form.current)

    fetch("/api/auth/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        Name: name,
        Phone: phone,
        Email: email,
        Role: role,
        Password: password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else throw Error("User creation failed");
      })
      .then((data) => {
        if (data.message) {
          setDisclaimer(data.message);
        } else {
          setDisclaimer(data.error);
        }
      })
      .then()
      .catch((err) => {
        setApiMessage("failed");
        console.log(err);
      });
  };

  const login = (e) => {
    e.preventDefault();
    //const data = new FormData(form.current)

    //setApiLoading(true);

    fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        Email: email,
        Password: password,
      }),
    })
      .then((response) => {
        return response.json();
        // if(response.ok){
        //   return response.json()}
        //else throw Error("Login Failed")
      })
      .then((data) => {
        if (data.message) {
          //setDisclaimer(data.message)
          if (data.message === "Login successful") {
            window.location.href = "/portal/statistics";
          }
        } else {
          setDisclaimer(data.error);
        }
      })
      .then()
      .catch((err) => {
        setApiMessage("failed");
        console.log(err);
      });
  };

  return (
    <div className="form">
      {props.page === "register" ? (
        <form ref={form} onSubmit={createUser}>
          <p className="disclaimer">{disclaimer}</p>
          <input
            type="text"
            label="Name"
            name="Name"
            placeholder="Enter username"
            onChange={(e) => setName(e.target.value)}
          ></input>
          <input
            type="text"
            label="Phone"
            name="Phone"
            placeholder="Enter phone number"
            onChange={(e) => setPhone(e.target.value)}
          ></input>
          <input
            type="text"
            label="Email"
            name="Email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <input
            type="text"
            label="Role"
            name="Role"
            placeholder="Select a Role"
            onChange={(e) => setRole(e.target.value)}
          ></input>
          <input
            type="text"
            label="Password"
            name="Password"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <input
            type="text"
            label="Confirm password"
            placeholder="Confirm password"
          ></input>
          <Button handleClick={() => {}} label="Create User" />
        </form>
      ) : (
        <form className="form" ref={form} onSubmit={login}>
          <h3>Login to KSA Data-portal</h3>
          <p className="disclaimer">{disclaimer}</p>
          <label htmlFor="input">
            Email <span>*</span>
          </label>
          <input
            type="text"
            label="Email"
            name="Email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <label htmlFor="input">
            Password <span>*</span>
          </label>
          <input
            type="text"
            label="Password"
            name="Password"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <Button handleClick={() => {}} label="Login" />
        </form>
      )}
      {/* {apiMessage && (
            <ApiMessages ref={getMessage} message={apiMessage} handleClick={closeApiMessage} />
      )} */}
    </div>
  );
};

export default Form;
