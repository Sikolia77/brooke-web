import { useRef, useEffect } from "react";
import "../Styles/SingleInstancePage.scss";
import DataPreview from "../components/Advocacy/AdvocacyPreview";
import Header from "../components/Utils/Header2";
import { useState } from "react";
export default function SingleInstancePage(props) {
  const pathname = window.location.pathname.split("/");
  const [service, setService] = useState(null);
  const [prompt, setPrompt] = useState();
  const [isErr, setIsErr] = useState("");
  const [isLoading, setIsLoading] = useState(null);
  const instanceId = window.location.pathname.split("/")[5];
  const [refresh, setRefresh] = useState(true);
  //
  const [successMsg, setSuccessMsg] = useState();
  const [changed, setChanged] = useState(false);
  const rfContent = useRef();
  const rfName = useRef();
  const [body, updateBody] = useState({
    To: instanceId,
    From: "",
    Subject: "",
    Content: "",
    UserID: "",
  });

  useEffect(() => {
    if (props.currentUser) {
      setPrompt("");
    }
  });

  return (
    <div className="wrapper">
      <div className="MainsContent">
        <div className="headings2">
          <Header
            isAuthenticated={props.isAuthenticated}
            setIsAuthenticated={props.setIsAuthenticated}
            currentUser={props.currentUser}
            setCurrentUser={props.setCurrentUser}
          />
        </div>
        <div className="SingleInstancePage">
          <div>
            {pathname[3] === "advocacy" && (
              <>
                <DataPreview instanceId={instanceId} />
              </>
            )}
            {pathname[3] === "health" && (
              <>
                <DataPreview instanceId={instanceId} />
              </>
            )}
            {pathname[3] === "community" && (
              <>
                <DataPreview instanceId={instanceId} />
              </>
            )}
            {pathname[3] === "partners" && (
              <>
                <DataPreview instanceId={instanceId} />
              </>
            )}
            {pathname[3] === "communication" && (
              <>
                <DataPreview instanceId={instanceId} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
