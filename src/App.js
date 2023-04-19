import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import BorrowPage from "./pages/BorrowPage.js";
import LiquidityProviderPage from "./pages/LiquidityProviderPage.js";
import TutorialPage from "./pages/TutorialPage.js";
import Navbar from "./pages/Navbar.js";
import NotFound from "./pages/NotFound.js";
import Borrow from "./components/Borrow.js";
import DashBoard from "./components/DashBoard.js";
import LiquidityProvider from "./components/LiquidityProvider.js";
import TotalLiquidity from "./components/totalLiquidity.js";

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/" end element={<Navigate to="/home" />} />
          <Route path="/platform" element={<BorrowPage />}>
            <Route path="/platform" element={<Borrow />} />
            <Route path="/platform/dashboard" end element={<DashBoard />} />
          </Route>
          <Route path="/lp" element={<LiquidityProviderPage />}>
            <Route path="/lp" element={<LiquidityProvider />} />
            <Route path="/lp/totalUser" end element={<TotalLiquidity />} />
          </Route>
          <Route path="/how-to" element={<TutorialPage />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" elemnet={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
