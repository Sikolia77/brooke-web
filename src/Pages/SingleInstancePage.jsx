import { useRef, useEffect } from "react";
import "../Styles/SingleInstancePage.scss";
import ThematicPreview from "../components/Advocacy/AdvocacyPreview";
import AnimalHealthPreview from "../components/AnimalHealth/AnimalHealthPreview";
import CommunityEngagementPreview from "../components/CommunityEngagement/CommunityEngagementPreview"
import Header from "../components/Utils/header";
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
      <div className="MainContent">
        <div className="headings">
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
                <ThematicPreview instanceId={instanceId} />
              </>
            )}
            {pathname[3] === "health" && (
              <>
                <AnimalHealthPreview instanceId={instanceId} />
              </>
            )}
            {pathname[3] === "community" && (
              <>
                <CommunityEngagementPreview instanceId={instanceId} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
