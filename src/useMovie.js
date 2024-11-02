import { useState, useEffect } from "react";

const API_KEY = "161388b1";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      // callback?.();
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`,
            { signal: controller.signal }
          );
          if (!res.ok) throw new Error(`Fetching movies failed`);
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
          console.log(data.Search);
          setIsLoading(false);
        } catch (e) {
          // console.error("Failed to fetch movies", e);
          if (e.name !== "AbortError") setError(e.message);
        } finally {
          setIsLoading(false);
          setError("");
        }
      }
      if (query.length < 2) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
