import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
// import CallbackPage from './pages/CallbackPage';
import Movies from './pages/Movies';
import Search from './pages/Search';
import AuthenticationGuard from './components/authentication-guard';
import Details from './pages/Details';

const App = () => {
  return (
    <div className="flex flex-col min-h-full bg-white dark:bg-gray-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/profile"
          element={<AuthenticationGuard component={Profile} />}
        />
        <Route
          path="/movies"
          element={<AuthenticationGuard component={Movies} />}
        />
        <Route
          path="/search"
          element={<AuthenticationGuard component={Search} />}
        />
        <Route
          path="/details"
          element={<AuthenticationGuard component={Details} />}
        />
        {/* <Route path="/profile" element={<Profile />} /> */}
        {/* <Route path="/callback" element={<CallbackPage />} /> */}
        {/* <Route path="/movies" element={<Movies />} />
        <Route path="/details" element={<Details />} />
        <Route path="/search" element={<Search />} /> */}
      </Routes>
    </div>
  );
};

export default App;
