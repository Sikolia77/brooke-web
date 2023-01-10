import React from "react";
import Loading from "../Utils/Loading";
import EditUserDetails from "./EditDetails";
import DetailsForm from "./DetailsForm";

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: false,
      showing: false,
      loading: false,
      editDetails: false,
      detailsForm: false,
    };
    this.getId = this.getId.bind(this);
    this.toggleOptions = this.toggleOptions.bind(this);
    this.toggleEditForm = this.toggleEditForm.bind(this);
    this.toggleDetailsForm = this.toggleDetailsForm.bind(this);
  }

  getId = (e) => {
    this.setState({ value: e.target.checked });
    this.props.getUserId(this.props.user.UserID, e.target.checked);
  };

  toggleOptions = () => {
    this.setState({ showing: !this.state.showing });
  };

  toggleEditForm = () => {
    this.setState({ editDetails: !this.state.editDetails});
  }

  toggleDetailsForm = () => {
    this.setState({ detailsForm: !this.state.detailsForm });
  }

  activateUser = () => {
    this.setState({ loading: true });
    fetch(`/api/auth/${this.props.user.UserID}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ Status: !this.props.user.Status }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else throw Error("");
      })
      .then((data) => {
        this.props.setChanged(!this.props.changed);
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  };

  deleteUser = () => {
    this.setState({ loading: true });
    fetch(`/api/auth/${this.props.user.UserID}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else throw Error("");
      })
      .then((data) => {
        this.props.setChanged(!this.props.changed);
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  };

  render() {
    return (
      <>
        <div
          onClick={() => {
            this.toggleOptions();
          }}
          onMouseLeave={() => {
            this.setState({ showing: false });
          }}
          className="tr"
        >
          <p>{this.props.sn}</p>
          <p>
            {this.props.user.Name.split(" ")
              .map((w) => w[0]?.toUpperCase() + w.substring(1).toLowerCase())
              .join(" ")}
          </p>
          <p>{this.props.user.Email}</p>
          <p>{this.props.user.Phone}</p>
          <p>{this.props.user.Position}</p>
          <p>{this.props.user.Department}</p>
          <p>{this.props.user.Role}</p>
          {this.props.user.Status ? (
            <p className="active">Active</p>
          ) : (
            <p className="inactive">Disabled</p>
          )}
          {this.state.showing && (
            <div className="options">
              {this.props.user.Role !== "Super Admin" && this.props.role === "Admin" &&
              <p onClick={()=>{
                this.toggleEditForm();
              }}>
                Edit Details
              </p>}
              {this.props.role === "Super Admin" &&
              <p onClick={()=>{
                this.toggleDetailsForm();
              }}>
                Edit Details
              </p>}
              {this.props.user.Status ? (
                <>
                {this.props.user.Role !== "Super Admin" && <p
                  onClick={() => {
                    this.activateUser();
                  }}
                >
                  Deactivate
                </p>}
                </>
              ) : (
                <>
                {this.props.user.Role != "Super Admin" && <p
                  onClick={() => {
                    this.activateUser();
                  }}
                >
                  Activate
                </p>}
                </>
              )}
              {this.props.user.Role != "Super Admin" && <p
                onClick={() => {
                  this.deleteUser();
                }}
              >
                Delete
              </p>}
            </div>
          )}
        </div>
        {this.state.loading && <Loading />}

        {this.props.user.Role !== "Super Admin" && this.state.editDetails && 
        <EditUserDetails
          toggleEditForm={this.toggleEditForm}
          setChanged={this.props.setChanged}
          changed={this.props.changed}
          userID={this.props.user.UserID}
          name={this.props.user.Name}
          phone={this.props.user.Phone}
          position={this.props.user.Position}
          department={this.props.user.Department}
         />}
         {this.state.detailsForm &&
          <DetailsForm 
            toggleDetailsForm={this.toggleDetailsForm}
            setChanged={this.props.setChanged}
            changed={this.props.changed}
            userID={this.props.user.UserID}
            name={this.props.user.Name}
            phone={this.props.user.Phone}
            position={this.props.user.Position}
            department={this.props.user.Department}
          />
         }
      </>
    );
  }
}
