import Button from "../../Utils/ButtonMain";
import ButtonOther from "../../Utils/ButtonOther";
import Select from "../../Utils/SelectMain";
import recImg from "../../../assets/imgs/recImg.png";
import drawImg from "../../../assets/imgs/drawImg.png";

export default function AOI(props) {
  const resetAll = () => {
    let dummy = `/geoserver/${props.workspace}/wfs?request=GetFeature&version=1.0.0&typeName=${props.workspace}:${props.layer}&outputFormat=json`;
    props.updateUrl(encodeURI(dummy));
  };

  return (
    <div className="items">
      <h3>Area of Interest</h3>
      <p>Define an area of interest to filter the dataset</p>
      <div className="div2equal">
        <Select label="Select Layer" data={["Layer1", "Layer2"]} />
        <></>
      </div>

      <h4>Select Method</h4>
      <div className="div2equal">
        <div className="aoi">
          <img className="imgSelected" src={recImg} alt="" />
          <p>Rectangle</p>
        </div>
        <div className="aoi">
          <img src={drawImg} alt="" />
          <p>Free Draw</p>
        </div>
      </div>
      <br></br>
      <Button label="Define AOI" />
      <ButtonOther handleClick={resetAll} label="Reset All" />
    </div>
  );
}
