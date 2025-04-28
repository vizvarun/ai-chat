import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Home from "./tabs/Home";
import TestCaseGenerator from "./tabs/TestCaseGenerator";
import ResumeScreener from "./tabs/ResumeScreener";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Close sidebar on route change
  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  // Close sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isSidebarOpen]);

  // Don't render nav/sidebar for auth routes
  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/signup";

  if (isAuthRoute) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div className={`app-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      {isAuthenticated && (
        <Sidebar
          isOpen={isSidebarOpen}
          onBackdropClick={closeSidebar}
          closeSidebar={closeSidebar}
        />
      )}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Protected routes requiring authorization */}
          <Route
            element={
              <ProtectedRoute requireAuth={true} requireAuthorization={true} />
            }
          >
            <Route
              path="/test-case-generator"
              element={<TestCaseGenerator />}
            />
          </Route>

          {/* Protected routes requiring only authentication */}
          <Route
            element={
              <ProtectedRoute requireAuth={true} requireAuthorization={false} />
            }
          >
            <Route path="/resume-screener" element={<ResumeScreener />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
