import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import FindStay from "./components/FindStay";
import StayDetail from "./components/StayDetail";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import Contact from "./components/Contact";
import Host from "./components/BecomeHost";
import MapView from "./components/MapView";
import Favorites from "./components/Favorites";
import Themes from "./components/Themes";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar always visible */}
        <Navbar />
        <div className="flex-grow">
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<HomePage />} />

            {/* Find Stay Route */}
            <Route path="/find-stay" element={<FindStay />} />

            {/* Stay Detail Route */}
            <Route path="/stay/:id" element={<StayDetail />} />

            {/* Authentication Routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            {/* Contact Route */}
            <Route path="/contact" element={<Contact />} />

            {/* Host Route */}
            <Route path="/become-host" element={<Host />} />

            {/* Map View Route */}
            <Route path="/map-view" element={<MapView />} />

            {/* Favorites Route - Protected */}
            <Route 
              path="/favorites" 
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              } 
            />

            {/* Themes Route */}
            <Route path="/themes" element={<Themes />} />

            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        {/* Footer (fixed at the bottom) */}
        <Footer />
      </div>
    </Router>
  );
}

// ProtectedRoute component to check authentication
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

export default App;