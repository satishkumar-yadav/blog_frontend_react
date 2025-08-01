import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";

function Navbar() {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null); // useState(null);
  // const [isLogin, setLogin] = useState("Login");
  const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar(); 

  // Check login status from localStorage , other tab also affected
   const checkLoginStatus = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      setUserData(null);
    }
  };

  /*
   useEffect(() => {
    const User = localStorage.getItem("user");
    const parseUser = JSON.parse(User);
    setUserData(User);
  }, [userData]);     */

  const logOut = () => {
    setLoading(true); 

    axios                                                
      .post("/api/logout" )
      .then(function (response) {
       // setLogin("Login");
        //   setMessage(response?.data?.message);
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("loginStatusChange"));
        setUserData(null);         // Trigger UI update  ///////
        enqueueSnackbar(response?.data?.message, { variant: "success" });
        navigate("/login");
      })

      .catch(function (error) {
         enqueueSnackbar(error?.response?.data?.message, { variant: "success" });
        // console.error("Logout Error:", error.response?.data?.message || error.message);
      })
      .then(function () {
         setLoading(false);
        // always executed
      });
  };

  useEffect(() => {
    checkLoginStatus();
  
    function onStorageChange(event) {
      if (event.key === "user") {
        checkLoginStatus();
      }
    }
    //window.addEventListener("storage", checkLoginStatus); // React to localStorage changes across tabs
    window.addEventListener("storage", onStorageChange);

    // Also, listen for a custom event on the window to sync same-tab login/logout
    function onLoginLogout() {
      checkLoginStatus();
    }
    window.addEventListener("loginStatusChange", onLoginLogout);


    return () => {
      // window.removeEventListener("storage", checkLoginStatus);
       window.removeEventListener("storage", onStorageChange);
      window.removeEventListener("loginStatusChange", onLoginLogout);

    };
      }, []);
 
  /*
  useEffect(()=>{
        if (userData) setLogin("Log Out")
  else setLogin("Login")
  },[userData]);   */
  
  return (
     
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6" > 

        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <svg 
             className="fill-current h-8 w-8 mr-2"
             width="54"
             height="54"
             viewBox="0 0 54 54"
             xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
          </svg>

          <span className="font-semibold text-xl tracking-tight">
            Golang Blog
          </span>
        </div>
                                 
        <label className="block lg:hidden cursor-pointer flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
         htmlFor="menu-toggle" >
             <svg
              className="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
             >
           <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
        </label>
                         
        <input className="hidden" type="checkbox" id="menu-toggle" />

        <div className="hidden w-full block flex-grow lg:flex lg:items-center lg:w-auto"
        id="menu" >
            <div className="text-sm lg:flex-grow">

               <Link  to="/"
                   className="block mt-4 text-base lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
                >
                   Home
                </Link>

                 <Link  to="/create"
                   className="block mt-4 text-base lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
                >
                  Create Post
                </Link>

                 {!userData && (
                <Link  to="/register"
                   className="block mt-4 text-base lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
                >
                   Register
                </Link>
                 )}

                <Link  to="/personal"
                   className="block mt-4 text-base lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
                >
                  My Post
                </Link>

                 {userData ? (
            <div
              onClick={logOut}
              className="block mt-4 text-base lg:inline-block lg:mt-0 text-teal-200 hover:text-white cursor-pointer"
            >
              Log Out
            </div>
          ) : (
            <Link
              to="/login"
              className="block mt-4 text-base lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
            >
              Login
            </Link>
          )}

            </div>
        </div>

    </nav>

  );
};

export default Navbar;


/*

<div onClick={logOut}
                     className="block mt-4 text-base lg:inline-block lg:mt-0 text-teal-200 hover:text-white cursor-pointer"
                >
                  {userData ? "Log Out" : 
                  <a href="/login"
                   className="block mt-4 text-base lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
                  >
                  Login
                </a>
                  }
                </div>

   */             