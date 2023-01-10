import React, { useEffect, useState } from "react";

const Page = (props) => {
  return (
    <>
      {props.offset === props.number && (
        <p
          onClick={() => props.handlePages(props.number)}
          className="page-active"
        >
          {props.number}
        </p>
      )}
      {props.offset !== props.number && (
        <p onClick={() => props.handlePages(props.number)} className="page">
          {props.number}
        </p>
      )}
    </>
  );
};

export default function Pagination(props) {
  const [array, setArray] = useState([]);
  const [isPrev, setIsPrev] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const pages = Math.ceil(parseInt(props.count) / 12);

  useEffect(() => {
    const lower = parseInt(props.page) + 1;
    const upper = lower + 5 > pages ? pages : lower + 5;
    let d = [];
    let diff = pages - lower;

    if (pages > 5 && diff > 5) {
      for (let i = lower; i < upper; i++) {
        d.push(i);
      }
    } else if (pages > 5 && diff <= 5) {
      let lw = pages - 5;
      for (let i = lw; i < upper; i++) {
        d.push(i);
      }
    } else {
      for (let i = 0; i < pages; i++) {
        d.push(i + 1);
      }
    }
    setArray(d);
    setIsNext(props.page < upper);
    setIsPrev(props.page > 0);
  }, [props.page]);

  function handlePages(index) {
    props.scrollPages(index - 1);
  }

  function handleNextPage() {
    props.scrollPages(props.page + 1);
  }

  function handlePreviousPage() {
    props.scrollPages(props.page - 1);
  }

  return (
    <div className="pagination">
      <div className="container">
        {isPrev && (
          <i
            className="fa fa-arrow-left"
            onClick={() => {
              handlePreviousPage(props.page);
            }}
          ></i>
        )}
        <div className="pages">
          {array.map((item) => {
            return (
              <Page
                key={item}
                handlePages={handlePages}
                offset={props.page + 1}
                number={item}
                count={props.count}
              />
            )
          })}
          {pages > 5 && (
            <>
              <h5>...</h5>
              <Page
                number={pages}
                handlePages={handlePages}
                offset={props.page + 1}
                count={props.count}
              />
            </>
          )}
        </div>
        {isNext && (
          <i
            className="fa fa-arrow-right"
            onClick={() => {
              handleNextPage(props.page);
            }}
          ></i>
        )}
      </div>
    </div>
  )
}
