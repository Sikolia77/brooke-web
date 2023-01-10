import { LayersControl, TileLayer } from "react-leaflet";
import myData from "../../assets/data/data";

export default function BaseMaps(params) {
  const { BaseLayer } = LayersControl;
  return (
   <>
      {myData.map((item, index) => {
        let checked = true;
        if (index !== 0) checked = false;
        return (
          <BaseLayer key={index} checked={checked} name={item.name}>
            <TileLayer attribution={item.attribution} url={item.url} />
          </BaseLayer>
        );
      })}
    </>
  );
}