import { useEffect, useState } from "react";
import Select from "./Others/Select";
import RangeClassification from "./Others/RangeClassification";
import UniqueClassification from "./Others/UniqueClassification";

export default function Layers(props) {
  const cls = ["Unique Classification", "Range Classification"];
  const [cols, setCols] = useState([]);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [isNumeric, setIsNumeric] = useState(false);

  useEffect(() => {
    if (props.body.data.layer) {
      let keys = Object.keys(props.body.data.layer.features[0].properties);
      setCols(keys);
      let d = props.body;
      if (!d.style.column) {
        d.style.column = keys[0];
        d.style.classes = calculateUniqueClasses(keys[0]);
      }
      if (!d.style.classification) {
        d.style.classification = cls[0];
        d.style.classes = calculateRangeClasses(keys[0]);
      } else {
        if (props.body.style.classification === cls[1]) {
          let values = [];
          props.body.data.layer.features.forEach((element) => {
            values.push(element.properties[props.body.style.column]);
          });
          setIsNumeric(!values.some(isNaN));
        }
      }
      props.updateBody(d);
    }
  }, []);

  const calculateUniqueClasses = (col) => {
    let cls = [];
    let values = [];
    props.body.data.layer.features.forEach((element) => {
      values.push(element.properties[col]);
    });
    let unique = new Set(values);
    unique = Array.from(unique);
    for (let i = 0; i < unique.length; i++) {
      cls.push({
        name: unique[i],
        color: getRandomColor(),
        enabled: true,
        count: countOccurrences(values, unique[i]),
      });
    }
    return cls;
  };

  const calculateRangeClasses = (col) => {
    let cls = [];
    let values = [];
    props.body.data.layer.features.forEach((element) => {
      values.push(element.properties[col]);
    });

    setIsNumeric(!values.some(isNaN));

    if (!isNumeric) return;

    let min = arrayMin(values);
    let max = arrayMax(values);
    setMin(min);
    setMax(max);
    let range = max - min;
    let classes = 5;
    let interval = range / classes;

    for (let i = 1; i < classes + 1; i++) {
      let lower = interval * (i - 1);
      let upper = interval * i;
      cls.push({
        name: `${withCommas(parseInt(lower))} - ${withCommas(parseInt(upper))}`,
        color: getRandomColor(),
        enabled: true,
        count: countRangeOccurrences(values, lower, upper),
        min: parseInt(lower),
        max: parseInt(upper),
      });
    }
    return cls;
  };

  const calculateCustomRangeClasses = (min, max) => {
    let values = [];
    props.body.data.layer.features.forEach((element) => {
      values.push(element.properties[props.body.style.column]);
    });
    return countRangeOccurrences(values, min, max);
  };

  const countRangeOccurrences = (arr, lower, upper) =>
    arr.reduce((a, v) => (v >= lower && v < upper ? a + 1 : a), 0);

  const countOccurrences = (arr, val) =>
    arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

  const getRandomColor = () => {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  function withCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function arrayMin(arr) {
    var len = arr.length,
      min = Infinity;
    while (len--) {
      if (Number(arr[len]) < min) {
        min = Number(arr[len]);
      }
    }
    return min;
  }

  function arrayMax(arr) {
    var len = arr.length,
      max = -Infinity;
    while (len--) {
      if (Number(arr[len]) > max) {
        max = Number(arr[len]);
      }
    }
    return max;
  }

  return (
    <div className="items">
      <h3>Map Layers</h3>
      <p>Design a thematic map.</p>
      <div className="div2equal">
        {props.body.style.column && (
          <Select
            selected={props.body.style.column}
            body={props.body}
            calculateRangeClasses={calculateRangeClasses}
            calculateUniqueClasses={calculateUniqueClasses}
            updateBody={props.updateBody}
            label="Select Column"
            data={cols}
          />
        )}
        {props.body.style.classification && (
          <Select
            selected={props.body.style.classification}
            label="Select Classification"
            calculateRangeClasses={calculateRangeClasses}
            calculateUniqueClasses={calculateUniqueClasses}
            body={props.body}
            updateBody={props.updateBody}
            data={cls}
          />
        )}
      </div>
      <p>Classes: {props.body.style.classes?.length} </p>
      {props.body.style.classification === cls[1] && (
        <p>
          Min: {min} , Max: {max}
        </p>
      )}
      {props.body.style.classification === cls[0] && (
        <UniqueClassification
          body={props.body}
          updateBody={props.updateBody}
          setMin={setMin}
          setMax={setMax}
        />
      )}
      {props.body.style.classification === cls[1] && (
        <RangeClassification
          body={props.body}
          updateBody={props.updateBody}
          calculateCustomRangeClasses={calculateCustomRangeClasses}
          isNumeric={isNumeric}
          setMin={setMin}
          setMax={setMax}
        />
      )}
    </div>
  );
}
