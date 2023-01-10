import {MapContainer,TileLayer,GeoJSON,MapConsumer} from "react-leaflet"
import useWFS from "../components/Utils/useWFS"
import Header from "../components/Utils/header"


export default function Map(props) {
  const states= useWFS('MyWorkspace:Lu')
  //const baselayer= useWFS('riyadh:Riyadh')

  const getColor =(feature)=>{
    let name = feature.properties.LU_2000
    switch (name) {
      case 'Cropland':
        return '#60af4a'
      case 'Forestland':
        return '#0b632b'
      case 'Otherland':
        return '#b96613'
      case 'Grassland':
        return '#b4ee63'
      case 'Wetlands':
        return '#36cad5'
      case 'Settlements':
        return '#200f0e'
      default:
        return '#FFBF00'
    }
  }


  const style = (feature) =>{
    return {
        fillColor: getColor(feature),
        weight: 0.1,
        opacity: 1,
        fillOpacity: 1
    };
  };

  let categories = [
"brownfield",
"farmyard",
"depot",
"agricultural",
]

let cats =  [];
let colors = [
    "#241F07",
    "#4D6FA3",
    "#97DF59",
    
]




function populateCategories(name, area) {
  const ar = (area !== undefined) ? area : 0

  if(name){
  let i = cats.map(function(e) { return e.name; }).indexOf(name);
  
  if(i !== -1){
    cats[i].value = cats[i].value + ar 
  }
  else {
    const index = categories.indexOf(name)
    let prop = {name:name,value:ar,color:colors[index],}
    cats.push(prop)
      }
    }
}

 function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
 
    return (
      <div>
        <Header
          isAuthenticated={props.isAuthenticated}
          setIsAuthenticated={props.setIsAuthenticated}
          currentUser={props.currentUser}
          setCurrentUser={props.setCurrentUser}
        />

        <div className="map">
          <MapContainer
            style={{ width: "100vw", height: "100vh" }}
            center={[0.3774, 37.66]}
            zoom={6}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            
            {states && <GeoJSON data={states} style={style} />}

            <MapConsumer>
              
            </MapConsumer>
          </MapContainer>
          <div className="sidebar">
            <div className="kpi">
              <h4>Land Use Mix</h4>

              <div className="tb">
                <h5>District KPI</h5>
                <h5>Optimum KPI</h5>
              </div>

              <div className="tb">
                <p>1.61</p>
                <p>1.61</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    
}