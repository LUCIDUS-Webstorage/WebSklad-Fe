import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
//import Dashboard from "./Dashboard";
import Home2 from "./Home2";
import Login1 from "./Login1";
//import Header from "./header";
import Ucet from "./Ucet";
//import PartsTest from "./PartsTest";


function App() {
  //return <Home2 />;
  /*return (
    <div>
      <Dashboard />
    </div>
  );*/
  /*return (
    <div>
      <h1>Moja Appka</h1>
      <PartsTest />
    </div>
  );*/
  /*return(
    
    <>
        <Header/>
        <Home2/>    
    </>

  );*/
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home2 />} />
        <Route path="/login" element={<Login1 />} />
        <Route path="/ucet" element={<Ucet />} />
      </Routes>
    </Router>
  );
}

export default App;
