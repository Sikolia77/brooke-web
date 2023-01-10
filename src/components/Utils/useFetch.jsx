import { useEffect, useState } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  
 useEffect(() => {
      fetch(`/api/${url}`, {
        method: "get",
        credentials: "include",
      })
        .then((res) => {
          console.log(res);
          if (!res.ok) {
            throw Error("Could not fetch data!!!");
          }
          return res.json();
        })
        .then((data) => {
          setData(data);
          setIsPending(false);
          setError(null);
        })
        .catch((err) => {
          setIsPending(false);
          setError(err.message);
        });
  }, [url]);

  return { data, isPending, error };
};

export default useFetch;
