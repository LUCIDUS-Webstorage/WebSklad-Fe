import { Routes, Route } from "react-router";
import './App.css';
import Suciastka from "./pages/Suciastka";
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
        <Route path="/Suciastka" element={<Suciastka/>}/>
        <Route index path="/home" element={<Home2 />} />
        <Route path="/" element={<Login1 />} />
        <Route path="/ucet" element={<Ucet />} />
      </Routes>
    )}

export default App;
