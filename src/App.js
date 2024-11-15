// import { BrowserRouter, Routes , Route, useLocation } from "react-router-dom";
// import './App.css';
// import Home from "./pages/home"
// import Navbar from "./pages/navbar"
// import Orders from "./pages/orders"
// import Product1 from "./pages/product1"
// import Custserv from "./pages/customerservice"
// import Conford from "./pages/confirmorder"
// import Invalid from "./pages/invalid"
// import Aboutus from "./pages/aboutus"
// import Signup from "./pages/signup"
// import Login from "./pages/login"
// import Logins from "./pages/logincomponent"

// function App() {
//   const location=useLocation();
//   return (
//     <div className="App">
//       <BrowserRouter>
//       {/* <Navbar /> */}
//       {location.pathname !== '/' &&  location.pathname !=='/Signup' && <Navbar/>}
//      <Routes>
     
//       <Route path="/home" element={<Home/>} />
//       <Route path="/p1" element={<Product1/>} />
//       <Route path="/customercare" element={<Custserv/>} />
//       <Route path="/confirmorder" element={<Conford/>} />
//       <Route path="/aboutus" element={<Aboutus/>}></Route>
//       <Route path="/orders" element={<Orders/>} />
//       <Route path="*" element={<Invalid/>} />
//       <Route path="/signup" element={<Signup/>} />
//       <Route path="/" element={<Login/>} />
//       <Route path='/logins' element={<Logins/>} />
//      </Routes>
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;


// import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
// import './App.css';
// import Home from "./pages/home";
// import Navbar from "./pages/navbar";
// import Orders from "./pages/orders";
// import Product1 from "./pages/product1";
// import Custserv from "./pages/customerservice";
// import Conford from "./pages/confirmorder";
// import Invalid from "./pages/invalid";
// import Aboutus from "./pages/aboutus";
// import Signup from "./pages/signup";
// import Login from "./pages/login";
// import Logins from "./pages/logincomponent";
// import P2 from "./pages/p2";

// function AppContent() {
//   const location = useLocation();
//   return (
//     <>
//       {location.pathname !== '/' && location.pathname !== '/signup' && <Navbar />}
//       <Routes>
//         <Route path="/home" element={<Home />} />
//         <Route path="/p1" element={<Product1 />} />
//         <Route path="/customercare" element={<Custserv />} />
//         <Route path="/confirmorder" element={<Conford />} />
//         <Route path="/aboutus" element={<Aboutus />} />
//         <Route path="/orders" element={<Orders />} />
//         <Route path="*" element={<Invalid />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/" element={<Login />} />
//         <Route path="/logins" element={<Logins />} />
//         <Route path="/p2" element={<P2/>} />
//       </Routes>
//     </>
//   );
// }

// function App() {
//   return (
//     <div className="App">
//       <BrowserRouter>
//         <AppContent />
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;


import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import Home from "./pages/home";
import Navbar from "./pages/navbar";
import Orders from "./pages/orders";
import Product1 from "./pages/product1";
import Custserv from "./pages/customerservice";
import Conford from "./pages/confirmorder";
import Invalid from "./pages/invalid";
import Aboutus from "./pages/aboutus";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Logins from "./pages/logincomponent";
import P2 from "./pages/p2";
import Webrtc from "./pages/webrtc";
import CategoryPage from "./pages/categorypage"; // Import the CategoryPage component

function AppContent() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== '/login' && location.pathname !== '/signup' && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/p1" element={<Product1 />} />
        <Route path="/customercare" element={<Custserv />} />
        <Route path="/confirmorder" element={<Conford />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="*" element={<Invalid />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/logins" element={<Logins />} />
        <Route path="/p2" element={<P2 />} />
        <Route path="/webrtc" element={<Webrtc/>} />
        <Route path="/category/:categoryName" element={<CategoryPage />} /> {/* Add category route */}
      </Routes>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
}

export default App;
