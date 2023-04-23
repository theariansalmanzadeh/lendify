import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
// import HomePage from "./pages/HomePage.js";
// import BorrowPage from "./pages/BorrowPage.js";
// import LiquidityProviderPage from "./pages/LiquidityProviderPage.js";
// import TutorialPage from "./pages/TutorialPage.js";
// import Navbar from "./pages/Navbar.js";
// import HowToUsePage from "./pages/HowToUsePage.js";
// import NotFound from "./pages/NotFound.js";
// import Borrow from "./components/Borrow.js";
// import DashBoard from "./components/DashBoard.js";
// import LiquidityProvider from "./components/LiquidityProvider.js";
// import TotalLiquidity from "./components/totalLiquidity.js";

const TutorialPage = React.lazy(() => import("./pages/TutorialPage.js"));
const BorrowPage = React.lazy(() => import("./pages/BorrowPage.js"));
const HomePage = React.lazy(() => import("./pages/HomePage.js"));
const LiquidityProviderPage = React.lazy(() =>
  import("./pages/LiquidityProviderPage.js")
);
const Navbar = React.lazy(() => import("./pages/Navbar.js"));
const HowToUsePage = React.lazy(() => import("./pages/HowToUsePage.js"));
const Borrow = React.lazy(() => import("./components/Borrow.js"));
const DashBoard = React.lazy(() => import("./components/DashBoard.js"));
const LiquidityProvider = React.lazy(() =>
  import("./components/LiquidityProvider.js")
);
const TotalLiquidity = React.lazy(() =>
  import("./components/totalLiquidity.js")
);

const loader = () => {
  <div>
    <ImSpinner3 />;
  </div>;
};

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Suspense fallback={loader}>
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
            <Route path="/about" element={<TutorialPage />} />
            <Route path="/how-to" element={<HowToUsePage />} />

            <Route path="*" elemnet={<Navigate to="/home" />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
