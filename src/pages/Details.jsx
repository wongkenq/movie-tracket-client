import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from 'react-icons/md';
import { SyncLoader } from 'react-spinners';

const apiKey = process.env.REACT_APP_MOVIE_API;
const api = process.env.REACT_APP_API || 'http://localhost:9000';

const Details = () => {
  const { state } = useLocation();
  const { movie } = state;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [director, setDirector] = useState([]);
  const { user, getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0();
  const [userInfo, setUserInfo] = useState({});
  const [isFav, setIsFav] = useState(false);
  const [token, setToken] = useState('');

  // const getToken = async () => {
  //   try {
  //     const accessToken = await getAccessTokenSilently({
  //       authorizationParams: {
  //         audience: 'http://localhost:9000',
  //         // scope: 'read:users',
  //       },
  //     });

  //     setToken(accessToken);
  //   } catch (error) {
  //     console.log(error.message);
  //     const accessToken = await getAccessTokenWithPopup({
  //       authorizationParams: {
  //         audience: 'http://localhost:9000',
  //         // scope: 'read:users',
  //       },
  //     });

  //     setToken(accessToken);
  //   }
  // };

  const getData = async () => {
    setLoading(true);
    await axios
      .get(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&language=en-US&append_to_response=credits,release_dates,`
      )
      .then((res) => {
        setData(res.data);
      })
      .then(console.log('Successfully requested movies'))
      .catch((err) => console.log(err));
  };

  const getUser = async () => {
    const info = await axios.get(`${api}/users/getUser/${user.email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUserInfo(info.data);
  };

  const addToFav = async () => {
    await axios.put(
      `${api}/users/addFav/${userInfo._id}`,
      {
        fav: {
          title: data.title,
          id: data.id,
          backdrop_path: data.backdrop_path,
          poster_path: data.poster_path,
          overview: data.overview,
          // credits: data.credits,
          // release_dates: data.release_dates.results,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setIsFav(true);
    console.log('added to fav');
  };

  const delFromFav = async () => {
    await axios.put(
      `${api}/users/delFav/${userInfo._id}`,
      { id: movie.id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setIsFav(false);

    console.log('deleted from fav');
  };

  useEffect(() => {
    const getToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: api,
            // scope: 'read:users',
          },
        });

        setToken(accessToken);
      } catch (error) {
        console.log(error.message);
        const accessToken = await getAccessTokenWithPopup({
          authorizationParams: {
            audience: api,
            // scope: 'read:users',
          },
        });

        setToken(accessToken);
      }
    };

    getToken();
  }, [getAccessTokenSilently]);

  useEffect(() => {
    getData();
    getUser();
  }, [token]);

  useEffect(() => {
    const func = async () => {
      const filter = await data.credits.crew.filter(
        (crew) => crew.department === 'Directing'
      );
      setDirector(filter);
    };

    func();
    setLoading(false);
  }, [data]);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.fav?.some((item) => item.id === movie.id)) {
        setIsFav(true);
      }
    }
  }, [userInfo]);

  if (loading)
    return (
      <div className="bg-white dark:bg-gray-900 flex min-h-full justify-center items-center grow-[1]">
        <SyncLoader color={'blue'} />
      </div>
    );
  else
    return (
      <section className="bg-white dark:bg-gray-900">
        <div className="container px-6 py-10 mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white">
            {movie?.title}
          </h1>

          <div className="mt-8 lg:-mx-6 lg:flex lg:items-center">
            <img
              className="object-cover w-full lg:mx-6 lg:w-1/2 rounded-xl h-72 lg:h-96"
              src={`https://image.tmdb.org/t/p/original/${movie?.backdrop_path}`}
              alt=""
            />

            <div className="mt-6 lg:w-1/2 lg:mt-0 lg:mx-6">
              <p className="text-lg text-blue-500 capitalize">
                {movie?.title} ({data.release_date?.split('-')[0]})
              </p>

              {/* <a
                className="block mt-4 text-2xl font-semibold text-gray-800 hover:underline dark:text-white"
                href="/"
              >
                All the features you want to know
              </a> */}

              <p className="mt-3 text-sm text-gray-500 dark:text-gray-300 md:text-sm">
                {movie?.overview}
              </p>

              <div className="flex items-center mt-6">
                <img
                  className="object-cover object-center w-10 h-10 rounded-full"
                  src={
                    loading || director[0]?.profile_path == null
                      ? '/user.png'
                      : `https://image.tmdb.org/t/p/w200/${director[0]?.profile_path}`
                  }
                  alt="Director"
                />

                <div className="mx-4">
                  <h1 className="text-sm text-gray-700 dark:text-gray-200">
                    {director[0]?.name}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Director
                  </p>
                </div>
              </div>
              {isFav ? (
                <button
                  onClick={delFromFav}
                  className="flex items-center px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80 mt-5"
                >
                  <MdOutlineFavorite className="w-5 h-5 mx-1" />
                  <span className="mx-1">Remove from Favorites</span>
                </button>
              ) : (
                <button
                  onClick={addToFav}
                  className="flex items-center px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80 mt-5"
                >
                  <MdOutlineFavoriteBorder className="w-5 h-5 mx-1" />
                  <span className="mx-1">Add to Favorites</span>
                </button>
              )}
              {/* <button onClick={getToken}>Get token</button> */}
            </div>
          </div>
        </div>
        <section className="container mx-auto px-6 py-10">
          <p className="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white sm:text-center md:text-left">
            Top Cast
          </p>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mt-10">
            {loading ? (
              <div className="bg-white dark:bg-gray-900 flex min-h-full justify-center items-center grow-[1]">
                <SyncLoader color={'blue'} />
              </div>
            ) : (
              data?.credits?.cast?.slice(0, 10).map((castMember) => (
                <div className="mx-auto" key={castMember.id}>
                  <div className="w-full max-w-xs overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800">
                    <img
                      className="object-cover w-full h-75 aspect-[2/3]"
                      src={
                        !loading &&
                        (castMember?.profile_path
                          ? `https://image.tmdb.org/t/p/original/${castMember?.profile_path}`
                          : '/blank-avatar.jpg')
                      }
                      alt="avatar"
                    />

                    <div className="py-5 text-center">
                      <p className="block text-xl font-bold text-gray-800 dark:text-white">
                        {castMember.name}
                      </p>

                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        {castMember.character}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </section>
    );
};

export default Details;
