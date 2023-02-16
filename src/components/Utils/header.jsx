import React, { useEffect, useState, useRef } from "react";
import logo from "../../assets/imgs/brookelogo.png";
import ModalHeader from "./modal_header";
import { useLocation } from "react-router-dom";
import Login from "./loginPopUp";
import RegisterPopUp from "./registerPopUp";
import UserAccount from "./userAccount";
import EditUserDetails from "./editUserDetails";
import ChangePassword from "./ChangePassword";

function NavLink(props) {
  const location = useLocation();
  let link;
  if (props.url === location.pathname) {
    link = (
      <h4
        className="underline"
        onClick={() => {
          window.location.href = props.url;
        }}
      >
        {props.txt}
      </h4>
    );
  } else {
    link = (
      <h4
        onClick={() => {
          window.location.href = props.url;
        }}
      >
        {props.txt}
      </h4>
    );
  }
  return link;
}

export default function Header(props) {
  const [firstRenderDone, setFirstRender] = useState(false);
  useEffect(() => {
    if (firstRenderDone) changeToggle("register");
  }, [props.toggleRegisterfromLanding]);
  useEffect(() => {
    setFirstRender(true);
  });

  const [clicked, setClicked] = useState(false);
  const [toggleLogin, setToggleLogin] = useState(false);
  const [toggleRegister, setToggleRegister] = useState(false);
  // const [isAuthenticated, setIsAuthenticated] = useState(true);
  //const [currentUser, setCurrentUser] = useState();
  const [showSettings, setShowSettings] = useState(false);
  const [toggleAccount, setToggleAccount] = useState(false);
  const [toggleEditDetails, setToggleEditDetails] = useState(false);
  const [toggleChangePass, setToggleChangePass] = useState(false);

  const toggleMenu = () => {
    setClicked(!clicked);
  };

  const logout = () => {
    fetch("/api/users/logout", {
      method: "get",
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        localStorage.clear();
        props.setIsAuthenticated(false);
        window.location.href = "/";
        props.setCurrentUser(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeToggle = (e) => {
    if (e === "login") {
      setToggleRegister(false);
      setToggleLogin(true);
    }
    if (e === "register") {
      setToggleLogin(false);
      setToggleRegister(true);
    }
  };

  const headerRef = useRef(null);
  // console.log(headerRef)

  if (headerRef.current) {
    if (props.parent == "landing") {
      if (props.changeHeaderTheme)
        headerRef.current.style.background = "#112D55";
      else headerRef.current.style.background = "none";
    } else headerRef.current.style.background = "#112D55";
  }

  return (
    <div className="pop">
      {toggleLogin && (
        <Login
          setToggleLogin={setToggleLogin}
          setToggleRegister={setToggleRegister}
          setIsAuthenticated={props.setIsAuthenticated}
        />
      )}
      {toggleAccount && (
        <UserAccount
          setToggleAccount={setToggleAccount}
          currentUser={props.currentUser}
        />
      )}
      {toggleEditDetails && (
        <EditUserDetails
          setToggleEditDetails={setToggleEditDetails}
          setToggleChangePass={setToggleChangePass}
          setIsAuthenticated={props.setIsAuthenticated}
          isAuthenticated={props.isAuthenticated}
          currentUser={props.currentUser}
        />
      )}
      {toggleChangePass && (
        <ChangePassword
          setToggleChangePass={setToggleChangePass}
          setIsAuthenticated={props.setIsAuthenticated}
          isAuthenticated={props.isAuthenticated}
          currentUser={props.currentUser}
        />
      )}

      <div className="header" id="header" ref={headerRef}>
        <div className="container">
          <div
            onClick={() => {
              window.location.href = "/";
            }}
            className="logo"
          >
            <img src={logo} className="lg" alt="Brooke E.A Logo" />
          </div>

          <div className="nav">
            <NavLink className="navlink" txt="Home" url="/" />
            <NavLink txt="Data" url="/data" />
            <NavLink txt="Map" url="/animalhealthdata" />
            <NavLink txt="About" url="/about" />
            <div
              className="nav2"
              onMouseOver={() => setShowSettings(true)}
              onMouseOut={() => setShowSettings(false)}
            >
              {props.isAuthenticated ? (
                <div className="loginOut">
                  <div>
                    {props.currentUser && props.currentUser.Name && (
                      <h5>
                        {props.currentUser.Name}{" "}
                        <span>
                          <i className="fa fa-caret-down"></i>
                        </span>
                      </h5>
                    )}
                  </div>
                  {showSettings ? (
                    <div className="userOptions showSettings">
                      <h5
                        onClick={() => {
                          setToggleAccount(true);
                        }}
                      >
                        Account
                      </h5>
                      <h5
                        onClick={() => {
                          window.location.href = "/admin";
                        }}
                      >
                        Admin Page
                      </h5>
                      <h5
                        onClick={() => {
                          setToggleChangePass(true);
                        }}
                      >
                        Change Password
                      </h5>
                      <h5
                        onClick={() => {
                          logout();
                        }}
                      >
                        Logout
                      </h5>
                    </div>
                  ) : (
                    <div className="userOptions">
                      <h5
                        onClick={() => {
                          {
                            setToggleAccount(true);
                          }
                        }}
                      >
                        Account
                      </h5>
                      <h5
                        onClick={() => {
                          setToggleEditDetails(true);
                        }}
                      >
                        Edit Details
                      </h5>
                      <h5
                        onClick={() => {
                          setToggleChangePass(true);
                        }}
                      >
                        Change Password
                      </h5>
                      <h5>Logout</h5>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="loginOut"
                  onClick={() => changeToggle("login")}
                >
                  Admin
                </button>
              )}
            </div>
          </div>
          <i
            onClick={() => {
              toggleMenu();
            }}
            className="fa fa-bars"
          ></i>
        </div>
      </div>
      {clicked && (
        <ModalHeader
          active={props.active}
          logout={logout}
          isAuthenticated={props.isAuthenticated}
          toggleMenu={toggleMenu}
          setToggleLogin={setToggleLogin}
          setToggleRegister={setToggleRegister}
          setIsAuthenticated={props.setIsAuthenticated}
        />
      )}
    </div>
  );
}
