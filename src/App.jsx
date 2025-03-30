import { Routes, Route } from "react-router";
import './App.css';
//import Dashboard from "./pages/Dashboard";
import Home2 from "./pages/Home2";
import Login1 from "./pages/Login1";
//import Header from "./components/feature/navigation/header";
import Ucet from "./pages/Ucet";
//import Dashboard from "./pages/Dashboard";
//import PartsTest from "./pages/PartsTest";
//import Dashboard2 from "./pages/Dashboard2";

/**
 * Use App.jsx as source for routing information
 */ 

function App() {
  return (
    
     <Routes>
        
        <Route index path="/home" element={<Home2 />} />
        <Route path="/login" element={<Login1 />} />
        <Route path="/ucet" element={<Ucet />} />
      </Routes>
    )}

export default App;
