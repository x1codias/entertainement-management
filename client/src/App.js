import { Navigate, Route, Routes } from 'react-router-dom';
import { Fragment } from 'react';

import Welcome from './pages/Welcome';
import Auth from './pages/Auth';
import Movies from './pages/Movies';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Shows from './pages/Shows';
import Animes from './pages/Animes';
import Books from './pages/Books';
import Games from './pages/Games';

function App() {
  return (
    <Fragment>
      <Sidebar />
      <Header />
      <Routes>
        <Route path="/" element={<Navigate replace to="/welcome" />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/shows" element={<Shows />} />
        <Route path="/animes" element={<Animes />} />
        <Route path="/books" element={<Books />} />
        <Route path="/games" element={<Games />} />
      </Routes>
    </Fragment>
  );
}

export default App;
