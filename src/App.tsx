import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import SignUpSuccessPage from "./pages/SignUpSuccessPage";
import CampaignsPage from "./pages/CampaignsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/sign-up-success" element={<SignUpSuccessPage />} />
      <Route path="/campaigns" element={<CampaignsPage />} />
    </Routes>
  );
}

export default App;
