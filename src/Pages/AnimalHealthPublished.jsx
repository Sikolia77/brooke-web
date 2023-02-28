import { React, useEffect, useState } from "react";
import Header from "../components/Utils/header";
import "leaflet/dist/leaflet.css";
import Footer from "../components/Utils/footer";
import "../Styles/DataPage.scss";
import DataSection from "../components/Utils/DataSection";
import Pagination from "../components/Utils/pagination";
import { useRef } from "react";

export default function AnimalHealthPublished(props) {
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [offset, setOffset] = useState(0);
  const [url, setUrl] = useState();
  const [searchData, setSearchData] = useState();

  const rfSearch = useRef();

  useEffect(() => {
    console.log("all");

    setUrl(`/gis/category/Health/${offset * 12}`);
  }, [offset]);

  const searchGis = () => {
    fetch(`/api/gis/search/${rfSearch.current.value}/${offset * 12}`, {
      method: "get",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("Could not fetch data!!!");
        }
        return res.json();
      })
      .then((data) => {
        setSearchData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetch(`/api/gis${url}`, {
      method: "get",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("Could not fetch messages!!!");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [url]);

  function scrollPages(offset) {
    setOffset(offset);
  }

  useEffect(() => {
    fetch(`/api/gis/Health/`, {
      method: "get",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("Could not fetch messages!!!");
        }
        return res.json();
      })
      .then((data) => {
        let list = [];
        data.result.forEach((item) => {
          list.push(item.Category);
        });
        setCategories(list);
      })
      .catch((err) => {});
  }, []);

  const onChangeOption = (e) => {
    setUrl("");
    setOffset(0);
    setSearchData(null);
    if (e.target.value === "All Categories") {
      setUrl(`/gis/category/Health/${offset * 12}`);
    } else {
      let url = `/category/${e.target.value}/${offset * 12}`;
      setUrl(url);
    }
  };

  return (
    <div>
      <div className="headings">
        <Header
          isAuthenticated={props.isAuthenticated}
          setIsAuthenticated={props.setIsAuthenticated}
          currentUser={props.currentUser}
          setCurrentUser={props.setCurrentUser}
        />
      </div>
      <div className="data">
        <div className="search">
          {categories && (
            <select id="" onChange={(e) => onChangeOption(e)}>
              <option defaultValue="All Categories">All Categories</option>
              {categories.map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
          )}

          <input type="search" placeholder="Search" ref={rfSearch}></input>
          <button onClick={searchGis}>
            <i class="fa fa-search" aria-hidden="true"></i>
          </button>
        </div>
        <div className="conten">
          {!searchData ? (
            <>
              {data && (
                <div id="s">
                  <h2>{props.title}</h2>
                  <div className="">
                    {data.result
                      ? data.result.map((item) => {
                          return (
                            <DataSection
                              url="/api/getcategory/name"
                              item={item}
                            />
                          );
                        })
                      : data.map((item) => {
                          return (
                            <DataSection
                              url="/api/getcategory/name"
                              item={item}
                            />
                          );
                        })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {searchData && (
                <div id="s">
                  <h2>{props.title}</h2>

                  <div className="">
                    {searchData.map((item) => {
                      return (
                        <DataSection url="api/getcategory/name" item={item} />
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {data && (
        <Pagination
          scrollPages={scrollPages}
          page={offset}
          count={data.total}
        />
      )}
    </div>
  );
}
