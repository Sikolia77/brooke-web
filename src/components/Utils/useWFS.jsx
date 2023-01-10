import { useEffect, useState } from "react";
import $ from "jquery";

const useWFS = (typename) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    var response = $.ajax({
      url: `/geoserver/${
        typename.split(":")[0]
      }/wfs?request=GetFeature&version=1.0.0&typeName=${typename}&outputFormat=json`,
      dataType: "json",
      error: function (xhr) {
        setData(null);
      },
    });

    $.when(response).done(function () {
      setData(response.responseJSON);
    });
  }, [typename]);

  return data;
};

export default useWFS;
