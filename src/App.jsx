import { Routes, Route } from "react-router";
import './App.css';
//import Dashboard from "./Dashboard";
import Home2 from "./pages/Home2";
import Login1 from "./pages/Login1";
//import Header from "./header";
import Ucet from "./pages/Ucet";
//import PartsTest from "./PartsTest";

/**
 * Use App.jsx as source for routing information
 */ 

function App() {
  return (
     <Routes>
        <Route index path="/" element={<Home2 />} />
        <Route path="/login" element={<Login1 />} />
        <Route path="/ucet" element={<Ucet />} />
      </Routes>
    )}

export default App;
