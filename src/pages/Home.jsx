import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Profile from './Profile';

const Home = () => {
  const { loginWithRedirect, user } = useAuth0();

  if (user) {
    return <Profile />;
  }

  return (
    <div className="bg-white dark:bg-gray-900 w-full flex justify-center items-center h-full grow-[1]">
      <div className="items-center lg:flex">
        <div className="w-full lg:w-1/2">
          <div className="lg:max-w-lg">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white lg:text-4xl">
              Best place to find your{' '}
              <span className="text-blue-500 ">Movies and TV Shows</span>
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro
              beatae error laborum ab amet sunt recusandae? Reiciendis natus
              perspiciatis optio.
            </p>

            <button
              onClick={loginWithRedirect}
              className="w-full px-5 py-2 mt-6 text-sm tracking-wider text-white uppercase transition-colors duration-300 transform bg-blue-600 rounded-lg lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
            >
              Log In
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
          <img
            className="w-full h-full lg:max-w-3xl"
            src="https://merakiui.com/images/components/Catalogue-pana.svg"
            alt="Catalogue-pana.svg"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
