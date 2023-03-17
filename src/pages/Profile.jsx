import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import { SyncLoader } from 'react-spinners';
const api = process.env.REACT_APP_API || 'http://localhost:9000';

const Profile = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    getAccessTokenWithPopup,
  } = useAuth0();
  const [userInfo, setUserInfo] = useState({});
  const [token, setToken] = useState('');

  useEffect(() => {
    const getToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: 'http://localhost:9000',
            // scope: 'read:users',
          },
        });

        setToken(accessToken);
      } catch (error) {
        console.log(error.message);
        const accessToken = await getAccessTokenWithPopup({
          authorizationParams: {
            audience: 'http://localhost:9000',
            // scope: 'read:users',
          },
        });

        setToken(accessToken);
      }
    };

    getToken();
  }, [getAccessTokenSilently]);

  const getUser = async () => {
    const currentUser = await user;
    // console.log(currentUser);
    const info = await axios.get(`${api}/users/getUser/${currentUser.email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (info.data) {
      setUserInfo(info.data);
    } else {
      createUser();
    }
  };

  const createUser = async () => {
    axios.post(`${api}/users/createUser`, {
      firstName: user.given_name,
      lastName: user.family_name,
      email: user.email,
    });

    console.log('User created');
  };

  useEffect(() => {
    getUser();
  }, [token, isLoading]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 w-full h-full flex justify-center items-center grow-[1]">
        <SyncLoader color={'blue'} />
      </div>
    );
  } else {
    return (
      isAuthenticated && (
        <div className="bg-white dark:bg-gray-900 dark:text-gray-200 flex justify-center items-center min-h-full grow-[1]">
          {/* sm:h-[calc(100vh-28px-32px)] lg:h-[calc(100vh-40px-32px)] */}
          <div className="container flex justify-center items-center flex-col">
            <div className="mb-5 self-start text-xl">
              Hi,{' '}
              <span className="text-3xl">
                {user?.given_name || user?.email}
              </span>
            </div>

            <div className="w-[500px] sm:w-fit lg:w-full bg-slate-300 dark:bg-slate-800 rounded-lg mb-5">
              <div className="uppercase text-5xl rounded-t-lg bg-slate-600 w-full p-4">
                Favorites
              </div>
              <div className="container grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-3">
                {userInfo?.fav?.length > 0 ? (
                  userInfo.fav?.map((item) => (
                    <MovieCard key={item.id} movie={item} />
                  ))
                ) : (
                  <div className="flex justify-center w-full">
                    <SyncLoader color={'blue'} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    );
  }
};

export default Profile;
