import { useEffect, useState } from "react";
import Button from "../../Utils/ButtonMain";
import ButtonOther from "../../Utils/ButtonOther";
import Input from "../../Utils/Input";
import MyError from "../../Utils/MyError";
import Select from "../../Utils/SelectMain";

export default function BuildQuery(props) {
  const operators = ["=", ">", "<", ">=", "<=", "<>", "ILIKE"];
  const [columns, setColumns] = useState(null);
  const [column, setColumn] = useState(null);
  const [operator, setOperator] = useState(operators[0]);
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (props.body.data.layer) {
      let keys = Object.keys(props.body.data.layer.features[0].properties);
      setColumns(keys);
      setColumn(keys[0]);
    }
  }, [props.body.data.layer]);

  const getOperator = (value) => {
    setOperator(value);
  };
  const getColumn = (value) => {
    setColumn(value);
  };
  const updateValue = (value) => {
    setValue(value);
  };

  const submitQuery = () => {
    if (props.body.data.layer) {
      let final = "";
      switch (operator) {
        case "LIKE":
          final = `CQL_FILTER=strToLowerCase(${column}) ${operator} '%${value.toLowerCase()}%'`;
          break;
        default:
          final = `CQL_FILTER=${column}${operator}'${value}'`;
          break;
      }
      let d = props.body;
      d.data.filters = final;
      props.updateBody(d);
    }
  };


  const resetAll = () => {
    let d = props.body;
    d.data.filters = null;
    props.updateBody(d);
  };

  return (
    <div className="items">
      <h3>Build a Custom Query</h3>

      {props.body.data.layer ? (
        <>
          <p>Select a layer, choose a column, and define query parameters</p>
          {columns && (
            <Select
              selected={column}
              label="Select Column"
              getSelected={getColumn}
              data={columns}
            />
          )}
          <Select
            label="Select Operator"
            getSelected={getOperator}
            selected={operator}
            data={operators}
          />
          <Input updateValue={updateValue} label="Your Input" />
          <Button handleClick={submitQuery} label="Run Query" />
          <ButtonOther handleClick={resetAll} label="Reset All" />
        </>
      ) : (
        <MyError txt="Please load some data into the map before querying." />
      )}
    </div>
  );
}
