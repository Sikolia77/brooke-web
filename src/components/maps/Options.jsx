export default function Options(props) {
  return (
    <div className="model22">
      <div className="container22">
        <h3>Select Section</h3>
        <h4
          onClick={() => {
            props.setType("Advocacy");
          }}
        >
          <i className="fa fa-map"></i> Advocacy and Innovation
        </h4>
        <h4
          onClick={() => {
            props.setType("Community");
          }}
        >
          <i className="fa fa-map"></i>Community Engagement
        </h4>
        <h4
          onClick={() => {
            props.setType("Health");
          }}
        >
          <i className="fa fa-map"></i>Animal Health
        </h4>
        <h4
          onClick={() => {
            props.setType("Communication");
          }}
        >
          <i className="fa fa-map"></i>Communication
        </h4>
        <h4
          onClick={() => {
            props.setType("Partners");
          }}
        >
          <i className="fa fa-map"></i>Partners
        </h4>
      </div>
    </div>
  );
}
