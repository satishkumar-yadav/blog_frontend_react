import { Route, Routes } from "react-router-dom";
//import SnackbarProvider from "react-simple-snackbar";
import { SnackbarProvider } from 'notistack'; // ✅ from notistack

//import { useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import BlogDetails from "./components/BlogDetails";
import CreateBlog from "./components/CreateBlog";
import EditPost from "./components/EditPost";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import PersonalBlog from "./components/PersonalBlog";
import Register from "./components/register";
import SessionManager from "./components/SessionManager";

function App() {
  /*
     const navigate = useNavigate();

  useEffect(() => {
  const expiry = localStorage.getItem("token_expiry");
  if (expiry) {
    const now = Date.now();
    if (now > expiry) {
      localStorage.removeItem("user");
      localStorage.removeItem("token_expiry");
      navigate("/login");
    } else {
      setTimeout(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("token_expiry");
        navigate("/login");
      }, expiry - now);
    }  
  }
}, []);

*/

  return (  
      <SnackbarProvider maxSnack={3} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <SessionManager />
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/create" element={<CreateBlog />} />
          <Route exact path="/detail/:id" element={<BlogDetails />} />
          <Route exact path="/personal" element={<PersonalBlog />} />
          <Route exact path="/edit/:id" element={<EditPost />} />
        </Routes>
      </SnackbarProvider>
  );
}

export default App;
  