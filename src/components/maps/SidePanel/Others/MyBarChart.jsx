import {forwardRef, React, useEffect, useState} from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Label } from "recharts";

const Barchart = (props, ref) => {

    const [data, setData] = useState([]);
    useEffect(() => {
      if (props.body.style.classes?.length > 0) {
        let d = [];
        props.body.style.classes.forEach((item) => {
          d.push({ name: item.name, value: item.count, fill: item.color });
        });
        setData(d);
        setTimeout(props.setReload(!props.reload), 10);
      }
    }, [props.body.style.classes]);

    return (
      <div>
        {data && (
          <div ref={ref}>
            <BarChart
              width={400}
              height={250}
              data={data}
              margin={{
                top: 5,
                bottom: 5,
              }}
              id="myChart"
            >
              <XAxis dataKey="name">
                {/* <Label
                  value="Facility"
                  position="insideBottom"
                  style={{ textAnchor: "middle" }}
                /> */}
              </XAxis>
              <YAxis>
                <Label
                  angle={-90}
                  value="Count"
                  position="insideLeft"
                  style={{ textAnchor: "middle" }}
                />
              </YAxis>
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </div>
        )}
      </div>
    );
}

export default forwardRef(Barchart);