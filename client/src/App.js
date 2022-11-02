import { Navigate, Route, Routes } from "react-router-dom";
import { Fragment } from "react";

import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Fragment>
      <Sidebar />
      <Header />
      <Routes>
        <Route path="/" element={<Navigate replace to="/welcome" />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Fragment>
  );
}

export default App;
