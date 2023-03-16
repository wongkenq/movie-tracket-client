import React, { useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
const apiKey = process.env.REACT_APP_MOVIE_API;

const Search = () => {
  const [input, setInput] = useState('');
  const [movieSearch, setMovieSearch] = useState([]);

  const searchMovies = async (e, input) => {
    e.preventDefault();

    await axios
      .get(
        `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=en-US&query=${input}&page=1&include_adult=false`
      )
      .then((res) => setMovieSearch(res.data.results));

    setInput('');
  };

  return (
    <div className="text-gray-500 dark:text-gray-300 container self-center mt-5 flex flex-col justify-center w-[100%]">
      <form
        onSubmit={(e) => searchMovies(e, input)}
        className="w-1/2 flex justify-between self-center sm:flex-col md:flex-row md:items-center md:mt-0"
      >
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          className="block placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-blue-300 focus:ring-opacity-40 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300 w-3/4 sm:w-full h-fit"
          type="text"
          placeholder="Search for a movie or TV show"
        />
        <button className="w-full sm:w-1/3 sm:self-center sm:mt-2 md:mt-0 md:ml-5 px-5 py-2 text-sm tracking-wider text-white uppercase transition-colors duration-300 transform bg-blue-600 rounded-lg lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
          Search
        </button>
      </form>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-3 lg:gap-5 py-4 px-4 justify-center lg:max-w-[1024px] lg:mx-auto">
        {movieSearch?.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Search;
