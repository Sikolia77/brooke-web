import { useRef, useState } from "react";
import Button from "../Utils/ButtonMain";
import Loading from "../Utils/Loading";
import UserInput from "./UsrInput";
import UserSelect from "./UsrSelect";

export default function NewPortalUser(props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fname = useRef();
  const lname = useRef();
  const email = useRef();
  const phone = useRef();
  const position = useRef();
  const department = useRef();
  const role = useRef();
  const password = useRef();
  const cpassword = useRef();

  const createUser = () => {
    const body = {
      Name: fname.current.getValue() + " " + lname.current.getValue(),
      Phone: phone.current.getValue(),
      Email: email.current.getValue(),
      Position: position.current.getValue(),
      Department: department.current.getValue(),
      Password: password.current.getValue(),
      cpassword: cpassword.current.getValue(),
      Role: role.current.getValue(),
    };
    setLoading(true);
    setError("");

    const validateForm = () => {
      let result = true;
      if (!validateEmail(body.Email)) {
        result = false;
        setError("Please Enter a valid email address!");
        setLoading(false);
        return result;
      }
      if (
        !validatePassword(body.Password) ||
        !validatePassword(body.cpassword)
      ) {
        result = false;
        setError("Password must be at least 6 characters!");
        setLoading(false);
        return result;
      }
      if (body.Password !== body.cpassword) {
        result = false;
        setError("Passwords do not match!!!");
        setLoading(false);
        return result;
      }
      if (!body.Phone || body.Phone.length !== 10) {
        result = false;
        setError("Enter a valid phone number (0712345678))");
        setLoading(false);
        return result;
      }
      if (!body.Name) {
        result = false;
        setError("Name is required!");
        setLoading(false);
        return result;
      }
      if (!body.Department) {
        result = false;
        setError("Department field is required!");
        setLoading(false);
        return result;
      }
      if (!body.Position) {
        result = false;
        setError("Enter Position Field");
        setLoading(false);
        return result;
      }
      if (!body.Role) {
        result = false;
        setError("Role is required!");
        setLoading(false);
        return result;
      }
      return result;
    };

    if (validateForm()) {
      fetch(`/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else throw Error("User Creation Failed");
        })
        .then((data) => {
          setLoading(false);
          if (data.success) {
            setError(data.success);
            window.location.href = "/admin/users";
          } else {
            setError(data.error);
          }
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  return (
    <div className="new">
      <h6>{error}</h6>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="div2equal">
          <UserInput ref={fname} type="text" label="First Name *" />
          <UserInput ref={lname} label="Surname *" />
        </div>
        <UserInput ref={email} type="email" label="Email *" />
        <UserInput ref={phone} type="phone" label="Phone *" />
        <div className="div2equal">
          <UserInput ref={department} type="text" label="Department *" />
          <UserInput ref={position} type="text" label="Position *" />
        </div>
        <UserSelect
          ref={role}
          label="Role *"
          data={["Guest", "User", "Admin"]}
        />
        <div className="div2equal">
          <UserInput ref={password} type="password" label="Password *" />
          <UserInput
            ref={cpassword}
            type="password"
            label="Confirm Password *"
          />
        </div>
        <Button handleClick={createUser} label="Submit" />
      </form>
      {loading && <Loading />}
    </div>
  );
}
