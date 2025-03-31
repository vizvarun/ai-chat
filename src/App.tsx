import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TestCaseGenerator from "./tabs/TestCaseGenerator";
import ChatWithMaggi from "./tabs/ChatWithMaggi";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/test-case-generator" replace />}
          />
          <Route path="/test-case-generator" element={<TestCaseGenerator />} />
          <Route path="/chat-with-maggi" element={<ChatWithMaggi />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
