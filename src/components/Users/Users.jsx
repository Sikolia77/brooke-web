import Pagination from "../Utils/pagination";
import User from "./User";
import { useEffect, useState } from "react";

export default function Users(props) {
  const [data, setData] = useState(null);
  const [offset, setOffset] = useState(0);
  const [changed, setChanged] = useState(false);
  const [sNo, setSNo] = useState(offset * 12 + 1);
  const [role, setRole] = useState();

  var jwt = require("jsonwebtoken");

  useEffect(() => {
    const token = localStorage.getItem("nimda_ksa");

    if (token) {
      var decoded = jwt.decode(token);
      setRole(decoded.Role);
    } else {
      setRole();
    }
  }, []);

  useEffect(() => {
    setData(null);
    setSNo(offset * 12 + 1);
    fetch(`/api/auth/paginated/${offset * 12}`, {
      method: "get",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("Could not fetch data!!!");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        props.setTotal(data.total);
        props.setActive(data.active);
        props.setInactive(data.inactive);
        var today = new Date();
        var date =
          today.getFullYear() +
          "-" +
          (today.getMonth() + 1) +
          "-" +
          today.getDate();
        var time =
          today.getHours() +
          ":" +
          today.getMinutes() +
          ":" +
          today.getSeconds();
        var dateTime = date + " " + time;
        props.setTime(dateTime);
      })
      .catch((err) => {});
  }, [changed, offset]);

  function scrollPages(offset) {
    setOffset(offset);
  }

  return (
    <div>
      {data ? (
        <p className="label">
          {(offset + 1) * 12 > data.total ? data.total : (offset + 1) * 12}/
          {data.total} Users
        </p>
      ) : (
        <p className="label">0/0 Users</p>
      )}
      <div className="table">
        <h5>Admin Portal Users</h5>
        <div className="table">
          <div className="thead">
            <div className="tr">
              <h4>SN</h4>
              <h4>Name</h4>
              <h4>Email</h4>
              <h4>Phone</h4>
              <h4>Position</h4>
              <h4>Department</h4>
              <h4>Role</h4>
              <h4>Status</h4>
            </div>
          </div>
          <div className="tbody">
            {data &&
              data.result &&
              data.result.map((user, index) => {
                return (
                  <User
                    changed={changed}
                    setChanged={setChanged}
                    key={user.UserID}
                    user={user}
                    sn={index + sNo}
                    role={role}
                  />
                );
              })}
          </div>
        </div>
        {data && (
          <Pagination
            scrollPages={scrollPages}
            page={offset}
            count={data.total}
          />
        )}
      </div>
    </div>
  );
}
