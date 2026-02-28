import css from "./App.module.css";

import SearchBar from "../SearchBar/SearchBar";
import type { Movie } from "../../types/movie";
import { handleFetch } from "../../services/movieService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import toast, { Toaster } from "react-hot-toast";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

function App() {
  const [selected, setSelected] = useState<Movie | null>(null);
  const [topic, setTopic] = useState("");
  const [page, setPage] = useState(1);

  const handleSearch = (topic: string) => {
    setTopic(topic);
    setPage(1);
  };

  const handleSelect = (movie: Movie | null) => {
    setSelected(movie);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movie", topic, page],
    queryFn: () => handleFetch(topic, page),
    enabled: topic !== "",
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.results.length === 0)
      toast.error("No movies found for your request.");
  }, [data, topic]);

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {<MovieGrid onSelect={handleSelect} movies={data?.results || []} />}
      {selected && (
        <MovieModal
          movie={selected}
          onClose={() => {
            handleSelect(null);
          }}
        />
      )}
      {data?.total_pages && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data?.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
