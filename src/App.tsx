import { Routes, Route } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <Routes>
      {/* All routing handled here */}
      <Route path="/*" element={<AppRoutes />} />
    </Routes>
  );
}

export default App;
