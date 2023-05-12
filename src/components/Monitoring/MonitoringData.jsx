import "../../Styles/monitoringData.scss";
import { useState } from "react";
import { useEffect } from "react";
import Pagination from "../../components/Utils/MonitoringPagination";
import WaveLoading from "../../components/Utils/WaveLoading";
import { isMobile } from "react-device-detect";

export default function Data(props) {
  const [data, setData] = useState(null);
  const [head, setHead] = useState(null);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [isloading, setIsLoading] = useState(false);
  const [showing, setShowing] = useState(null);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${props.url}/${offset}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        setIsLoading(false);
        if (data?.data?.length > 0) {
          const cols = Object.keys(data.data[0]);
          let d = [];
          cols.forEach((item) => {
            if (
              item.toLowerCase() !== "objectid" &&
              item.toLowerCase() !== "id" &&
              item.toLowerCase() !== "latitude" &&
              item.toLowerCase() !== "longitude"
            ) {
              d.push(item);
            }
          });
          if (isMobile) {
            setCount(2);
          } else {
            let c = d.length > 7 ? 7 : d.length;
            setCount(c);
          }
          setHead(d);
          setData(data);
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }, [offset]);
  const saveData = (data) => {
    console.log(data);
    if (data?.length > 0) {
      let rows = [];
      rows.push(Object.keys(data[0]));
      data.map((item) => {
        rows.push(Object.values(item));
      });
      let csvContent =
        "data:text/csv;charset=utf-8," +
        rows.map((e) => e.join(",")).join("\n");

      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "data.csv");
      document.body.appendChild(link);
      link.click();
    }
  };

  return (
    <div className="data">
      <div className="list">
        <h3>{props.title}</h3>
        <div className="downloads">
          <div>
            <a
              onClick={() => {
                saveData();
              }}
              role="button"
            >
              <i className="fa fa-download"></i>Data
            </a>
          </div>
        </div>
        <hr />
        <div
          style={{
            gridTemplateColumns: `repeat(${head ? count : 0},1fr)`,
          }}
          className="head"
        >
          {head &&
            head.length > 0 &&
            head.map((item, i) => {
              if (i < count) {
                return <h4 key={i}>{item}</h4>;
              }
            })}
        </div>

        {data &&
          data?.data?.length > 0 &&
          data?.data?.map((item, i) => {
            return (
              <Item
                setShowing={setShowing}
                key={i}
                index={i}
                data={item}
                head={head}
                count={count}
              />
            );
          })}

        {data?.total && (
          <Pagination total={data?.total} setOffset={setOffset} page={offset} />
        )}
        {showing !== null && (
          <Popup
            showing={showing}
            editing={editing}
            setEditing={setEditing}
            setShowing={setShowing}
            data={data?.data}
            url={props.url}
          />
        )}
      </div>

      {isloading && <WaveLoading />}
    </div>
  );
}

const Popup = (props) => {
  const [isLoading, setIsLoading] = useState(null);
  const [cols, setCols] = useState(null);
  const [cls, setCls] = useState(null);
  const [data, setData] = useState(null);
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState("All Data");

  useEffect(() => {
    setIsLoading(true);
    setCols(null);
    setCls(null);
    setData(null);
    if (props.showing !== null) {
      const cols = Object.keys(props.data[props.showing]);
      let d = [];
      cols.forEach((item) => {
        if (item.toLowerCase() !== "geom") {
          d.push(item);
        }
      });
      setCols(d);
    }
    setIsLoading(false);
  }, [active]);

  const Bar = (params) => {
    return (
      <p
        onClick={() => {
          setActive(params.txt);
        }}
        className={active === params.txt ? "active" : ""}
      >
        {params.txt}
      </p>
    );
  };

  return (
    <div data-aos="fade-left" className="monitoringpopup">
      <div className="container">
        <div className="dets">
          <h3>{props?.data[props.showing]?.Name}</h3>
          <i
            onClick={() => {
              props.setShowing(null);
            }}
            className="fa fa-times"
          ></i>
        </div>
        <div className="bar">
          <Bar txt="All Data" />
        </div>
        <div className="content">
          {cols &&
            cols.map((item, i) => {
              return (
                <p key={i}>
                  <b>{item}</b> {props.data[props.showing][item]}
                </p>
              );
            })}
          {cls &&
            cls.map((item, i) => {
              return (
                <p key={i}>
                  <b>{item}</b>{" "}
                  {item == "updatedAt" || item == "createdAt"
                    ? data[index][item].split("T")[0]
                    : data[index][item]}
                </p>
              );
            })}
          {isLoading && <WaveLoading />}
          <div className="tally">
            {data &&
              data.length > 1 &&
              data.map((item, i) => {
                return (
                  <p
                    className={i === index ? "active" : ""}
                    onClick={() => {
                      setIndex(i);
                    }}
                    key={i}
                  >
                    {i + 1}
                  </p>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

const Item = (props) => {
  const cl = props.index % 2 == 0 ? "white" : "#60606010";

  return (
    <div
      style={{
        gridTemplateColumns: `repeat(${props.head ? props.count : 0},1fr)`,
        backgroundColor: cl,
      }}
      className="row"
      onClick={() => {
        props.setShowing(props.index);
      }}
    >
      {props.head.map((item, i) => {
        if (i < props.count) {
          return <p key={i}>{props.data[item]}</p>;
        }
      })}
    </div>
  );
};
