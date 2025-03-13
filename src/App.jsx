import { Routes, Route } from "react-router";
import './App.css';
import Dashboard from "./pages/Dashboard";
//import Home2 from "./pages/Home2";
import Login1 from "./pages/Login1";
//import Header from "./header";
import Ucet from "./pages/Ucet";
//import Dashboard from "./pages/Dashboard";
//import PartsTest from "./pages/PartsTest";

/**
 * Use App.jsx as source for routing information
 */ 

function App() {
  return (
     <Routes>
        <Route index path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login1 />} />
        <Route path="/ucet" element={<Ucet />} />
      </Routes>
    )}

export default App;
