import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
const api = `https://api.themoviedb.org/3/movie/popular`;
const apiKey = process.env.REACT_APP_MOVIE_API;

const Movies = () => {
  const [movies, setMovies] = useState([]);
  // const [movieSearch, setMovieSearch] = useState([]);
  // const [input, setInput] = useState('');

  useEffect(() => {
    axios
      .get(`${api}/?api_key=${apiKey}`)
      .then((res) => setMovies(res.data.results));
  }, []);

  // const searchMovies = async (e, input) => {
  //   e.preventDefault();

  //   await axios
  //     .get(
  //       `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${input}&page=1`
  //     )
  //     .then((res) => setMovieSearch(res.data.results));
  // };

  return (
    <div className="bg-white dark:bg-gray-900 max-w-xxl grow">
      <h1>Popular Movies</h1>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-3 lg:gap-5 py-4 px-4 justify-center lg:max-w-[1024px] lg:mx-auto">
        {movies?.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      {/* <form onSubmit={(e) => searchMovies(e, input)}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button>submit</button>
      </form>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-3 lg:gap-5 py-4 px-4 justify-center lg:max-w-[1024px] lg:mx-auto">
        {movieSearch?.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div> */}
    </div>
  );
};

export default Movies;
