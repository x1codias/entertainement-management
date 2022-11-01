import { Navigate, Route, Routes } from "react-router-dom";

import Welcome from "./pages/Welcome";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/welcome" />} />
      <Route path="/welcome" element={<Welcome />} />
    </Routes>
  );
}

export default App;
