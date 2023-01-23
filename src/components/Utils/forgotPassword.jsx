import { useRef, useState } from "react";
import Loading from "../Utils/Loading";

export default function ForgotPassword(props) {
  const email = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [forgot, setForgot] = useState(true);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState("");
  const [body, updateBody] = useState({ Email: null });

  const resetPassword = () => {
    let d = body;
    d.Email = email.current.value;
    updateBody(d);
    setIsError("");

    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    if (!validateEmail(body.Email)) {
      return setIsError("Please provide a valid email address");
    }

    if (validateEmail(body.Email)) {
      setIsLoading(true);
      fetch("/api/users/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ Email: email.current.value }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else throw Error("Failed");
        })
        .then((data) => {
          if (data.success) {
            setIsLoading(false);
            setMessage(data.success);
            setTimeout(() => {
              setForgot(false);
            }, 1000);
          } else {
            setIsError(data.error);
            setIsLoading(false);
          }
        })
        .catch((e) => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="model">
      <div className="forgotPassword">
        <h4>Forgot Password</h4>
        <h6 className="cancel">{message}</h6>
        <p>We'll generate a password</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <span className="err">{isError}</span>
          <input ref={email} type="email" placeholder="Your email" />
          <button
            onClick={() => {
              resetPassword();
            }}
            className="button"
          >
            Send
          </button>
        </form>
        <h6
          className="cancel"
          onClick={() => {
            props.setForgot(false);
          }}
        >
          Cancel
        </h6>

        {isLoading && <Loading />}
      </div>
    </div>
  );
}
