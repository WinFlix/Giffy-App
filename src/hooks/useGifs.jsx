import { useEffect, useState } from "react";
import { useGif } from "../context/gifContext";
import { getAllGIfs } from "../utils/getGifs";

const INITIAL_PAGE = 0;

export const useGifs = ({ keyword, limit, rating } = { keyword: null }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ errorCode: "", trueOrFalse: false });
  const [loadingPage, setLoadingPage] = useState(false);
  const [page, setPage] = useState(INITIAL_PAGE);
  const { gifs, setGifs } = useGif();

  const keywordToUse = keyword || localStorage.getItem("lastKeyword");
  const ratingToUse = rating || localStorage.getItem("lastRating");

  useEffect(() => {
    setLoading(true);
    getAllGIfs({ keyword: keywordToUse, limit, rating: ratingToUse })
      .then((gif) => {
        setGifs(gif);
        setLoading(false);
        localStorage.setItem("lastKeyword", keywordToUse);
        localStorage.setItem("lastRating", ratingToUse);
      })
      .catch((e) => {
        setLoading(false);
        setError({ errorCode: "", trueOrFalse: true });
        if (e.message == "Failed to fetch") {
          setError({
            errorCode: "Connection error, check your connection and try again",
            trueOrFalse: true,
          });
        }
      });
  }, [keyword, keywordToUse, setGifs, rating]);

  useEffect(() => {
    if (page === INITIAL_PAGE) return;
    setLoadingPage(true);
    getAllGIfs({ keyword: keywordToUse, page, rating })
      .then((nextGifs) => {
        setLoadingPage(false);
        setGifs((prevGifs) => {
          const { data, pagination } = prevGifs;
          return { data: [...data, ...nextGifs.data], pagination: pagination };
        });
      })
      .catch((e) => {
        setError(true);
        setLoading(false);
      });
  }, [page, keywordToUse, rating, setGifs]);

  return { loading, loadingPage, gifs, setPage, error };
};
