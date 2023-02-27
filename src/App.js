import { React, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import "./App.scss";
import Aos from "aos";
import "aos/dist/aos.css";
import NotFound from "./Pages/404";
import Landing from "./Pages/Landing";
import Map from "./Pages/Map";
import NewMap from "./Pages/NewMap";
import DataPage from "./Pages/DataPage";
import SingleInstancePage from "./Pages/SingleInstancePage";
import AboutPage from "./Pages/AboutPage";
import AdminPage from "./Pages/AdminPage";
import Category from "./Pages/Category";
import NewInstancesPage from "./Pages/NewInstancesPage";
import UsersPage from "./Pages/Users";
import NewUser from "./Pages/NewUser";
import LoginPage from "./Pages/LoginPage";
import Advocacy from "./components/PublishedInstances/Advocacy";
import CommunityEngagement from "./components/PublishedInstances/CommunityEngagement";
import AnimalHealth from "./components/PublishedInstances/AnimalHealth";
import Partners from "./components/PublishedInstances/Partners";
import Communication from "./components/PublishedInstances/Communication";
import MapData from "./Pages/MapData";
import CommunityData from "./Pages/CommunityData";
import CommunicationData from "./Pages/CommunicationData";
import PartnersData from "./Pages/PartnersData";
import AnimalHealthData from "./Pages/AnimalHealthData";
import ProtectedRoute from "./components/login/ProtectedRoute";

function App() {
  useEffect(() => {
    Aos.init();
  }, []);

  const [role, setRole] = useState();

  var jwt = require("jsonwebtoken");

  useEffect(() => {
    const token = localStorage.getItem("cilbup_ksa");

    if (token) {
      var decoded = jwt.decode(token);
      setRole(decoded.Role);
      console.log(decoded.Role);
    } else {
      setRole();
    }
  }, []);

  var jwt = require("jsonwebtoken");

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();
  const [page, setPage] = useState();
  const [instancePage, setInstancePage] = useState();
  const [body, updateBody] = useState({
    Page: null,
    Adress: null,
    Keywords: null,
    OtherInfo: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("cilbup_ksa");
    if (token) {
      try {
        var decoded = jwt.decode(token);
        //window.location.reload(false)
        setCurrentUser(decoded);

        if (Date.now() >= decoded.exp * 1000) {
          setIsAuthenticated(false);
        } else {
          //window.location.reload(false)
          setIsAuthenticated(true);
        }
      } catch (error) {
        //window.location.reload(false)
        setIsAuthenticated(false);
      }
    } else {
      //window.location.reload(false)
      setIsAuthenticated(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    trackPageView(); // To track the first pageview upon load
  }, []);

  function trackPageView() {
    const pathDirectories = window.location.pathname.split("/");
    if (pathDirectories.length > 2) {
      if (pathDirectories.includes("instances")) {
        setPage("Instances");
        setInstancePage(pathDirectories[3]);
      }
    } else {
      if (pathDirectories.length === 2) {
        switch (pathDirectories[1]) {
          case "":
            setPage("Home");
            break;
          case "admin":
            setPage("Admin");
            break;
          case "about":
            setPage("About Us");
            break;
          case "data":
            setPage("Data");
            break;
        }
      } else {
        setPage(pathDirectories[1]);
      }
    }
  }

  useEffect(() => {
    let d = body;
    d.Page = page;
    d.Keywords = instancePage ? instancePage : null;
    d.OtherInfo = window.location.pathname;
    updateBody(d);
    page &&
      fetch("/api/stats/create", {
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
          } else throw Error("");
        })
        .catch((err) => {});
  }, [page]);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Landing
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>

        <Route exact path="/loginpage">
          <LoginPage
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>

        <Route exact path="/category/*">
          <Category
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>

        <Route exact path="/nmap">
          <Map
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>

        <Route exact path="/data">
          <DataPage
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>

        <Route exact path="/mapdata">
          <MapData
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>

        {/* <Route exact path="/animalhealthdata">
          <AnimalHealthData
            // isAuthenticated={isAuthenticated}
            // setIsAuthenticated={setIsAuthenticated}
            // currentUser={currentUser}
            // setCurrentUser={setCurrentUser}
          />
        </Route> */}

        {role == "Admin" && (
          <ProtectedRoute
            exact
            path="/communitydata"
            component={CommunityData}
          />
        )}

        {role == "Admin" && (
          <ProtectedRoute
            exact
            path="/animalhealthdata"
            component={AnimalHealthData}
          />
        )}

        {role == "Admin" && (
          <ProtectedRoute
            exact
            path="/communicationsdata"
            component={CommunicationData}
          />
        )}

        {role == "Admin" && (
          <ProtectedRoute exact path="/partnersdata" component={PartnersData} />
        )}

        <Route exact path="/map">
          <NewMap
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>

        <Route exact path="/admin/instances/*">
          <SingleInstancePage
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>

        <Route exact path="/admin/newinstance">
          <NewInstancesPage />
        </Route>

        <Route exact path="/about">
          <AboutPage
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>

        <Route exact path="/admin">
          <AdminPage
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>

        <Route exact path="/admin/users">
          <UsersPage
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>

        <Route exact path="/admin/users/create">
          <NewUser
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>

        <Route exact path="/advocacy">
          <Advocacy
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>

        <Route exact path="/communityengagement">
          <CommunityEngagement
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>
        <Route exact path="/animalhealth">
          <AnimalHealth
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>
        <Route exact path="/partners">
          <Partners
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>
        <Route exact path="/communication">
          <Communication
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
