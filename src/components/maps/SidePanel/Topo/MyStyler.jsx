import Button from "../../../Utils/ButtonMain";
import Input from "./Input";

export default function MyStyler(props) {
  const fillColor = (e) => {
    let d = props.body;
    d.styles[props.index].fillColor = e.target.value;
    props.updateBody(d);
  };
  const fillOpacity = (e) => {
    let d = props.body;
    d.styles[props.index].fillOpacity = e.target.value;
    props.updateBody(d);
  };

  const strokeColor = (e) => {
    let d = props.body;
    d.styles[props.index].color = e.target.value;
    props.updateBody(d);
  };

  const strokeOpacity = (e) => {
    let d = props.body;
    d.styles[props.index].opacity = e.target.value;
    props.updateBody(d);
  };

  const closeStyler = () => {
    props.openStyler(null);
  }

  return (
    <div className="styler">
      <div className="contnr">
        <h4>Style Layer</h4>
        <div className="div2equal">
          <div className="stl">
            <label htmlFor="">Fill color</label>
            <Input
              type="color"
              value={props.body.styles[props.index].fillColor}
              onChange={fillColor}
            />
          </div>
          <div className="stl">
            <label htmlFor="">Fill opacity (0-1)</label>
            <Input
              type="number"
              max={1}
              min={0}
              value={props.body.styles[props.index].fillOpacity}
              onChange={fillOpacity}
            />
          </div>
        </div>
        <div className="div2equal">
          <div className="stl">
            <label htmlFor="">Stroke color</label>
            <Input
              type="color"
              value={props.body.styles[props.index].color}
              onChange={strokeColor}
            />
          </div>
          <div className="stl">
            <label htmlFor="">Stroke opacity (0-1)</label>
            <Input
              type="number"
              max={1}
              min={0}
              value={props.body.styles[props.index].opacity}
              onChange={strokeOpacity}
            />
          </div>
        </div>
        <Button label="Close" handleClick={closeStyler} />
      </div>
    </div>
  );
}
