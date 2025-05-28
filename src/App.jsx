import { Routes, Route } from "react-router";
import './App.css';
import Suciastka from "./pages/Suciastka";
import Home2 from "./pages/Home2";
import Login1 from "./pages/Login1";
import Ucet from "./pages/Ucet";
import Upravene from "./pages/upravene";
import Schemy from "./pages/Schemy";


function App() {
  return (
    
     <Routes>
        <Route path="/Schemy" element={<Schemy/>}/>
        <Route path="/Upravene" element={<Upravene/>}/>
        <Route path="/Suciastka" element={<Suciastka/>}/>
        <Route path="/home" element={<Home2 />} />
        <Route path="/" element={<Login1 />} />
        <Route path="/ucet" element={<Ucet />} />
      </Routes>
    )}

export default App;
