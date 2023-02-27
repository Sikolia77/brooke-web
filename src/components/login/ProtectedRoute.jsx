import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";

function ProtectedRoute({ component: Component, ...restOfProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  var jwt = require("jsonwebtoken");

  useEffect(() => {
    const token = localStorage.getItem("cilbup_ksa");
    if (token) {
      try {
        var decoded = jwt.decode(token);
        if (Date.now() >= decoded.exp * 1000) {
          setIsAuthenticated(false);
        } else setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const logout = () => {
    fetch("/api/publicauth/logout", {
      method: "get",
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        localStorage.clear();
        window.location.href = "/";
      })
      .catch((e) => {
        localStorage.clear();
        window.location.href = "/";
      });
  };

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : logout()
      }
    />
  );
}

export default ProtectedRoute;
