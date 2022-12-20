import { Navigate, Route, Routes } from 'react-router-dom';

import Welcome from './pages/Welcome';
import Auth from './pages/Auth';
import Movies from './pages/Movies';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Shows from './pages/Shows';
//import Animes from './pages/Animes';
import Books from './pages/Books';
import Games from './pages/Games';
import MovieDetails from './pages/MovieDetails';
import ShowDetails from './pages/ShowDetails';
//import AnimeDetails from './pages/AnimeDetails';
import BookDetails from './pages/BookDetails';
import GameDetails from './pages/GameDetails';
import { useAuth } from './hooks/auth-hook';
import { AuthContext } from './context/auth-context';

const App = () => {
  const { token, login, logout, userId } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Sidebar>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate replace to="/welcome" />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/shows/:id" element={<ShowDetails />} />
          {/* <Route path="/animes" element={<Animes />} />
          <Route path="/animes/:id" element={<AnimeDetails />} /> */}
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/:id" element={<GameDetails />} />
        </Routes>
      </Sidebar>
    </AuthContext.Provider>
  );
};

export default App;
