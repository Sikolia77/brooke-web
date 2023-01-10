import React from "react";
import useFetch from "./useFetch";
import MapCategory from "../maps/MapCategory";

export default function SectionMain(props) {
    const { data, isPending, error } = useFetch(props.url)
    
    //Try to use useState
    return (
      <div className="InstancesPage">
        {isPending && <p>Loading...</p>}
        {error && <p>error</p>}
            {data &&
              data.result.map((item, index) => {
                return <MapCategory key={index} category={item.Category} />;
              })}
      </div>
    );
}
