import { useEffect, useState } from "react";
import "./Home.css";

import { Link } from "react-router-dom";
// import axios from "../api/axios.js";
import BlogPost from "./BlogPost";

const Home = () => {

  const [userData, setUserData] = useState(null); 
  /*  
React will re-render the component when it updates.
💡 Alternatives:
const [userData, setUserData] = useState(() => JSON.parse(localStorage.getItem("user"))); // directly initialize from storage
*/

  //  useEffect(()=>{
  //   // axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/check-auth`,{
  //   //       withCredentials: true,
  //   //     })
  //   axios.get("/api/check-auth")
  //   .then(res=>console.log("COOKIE:",res.data))
  //   .catch(err=>console.log("Cookie Error:",err));
  //  },[]);

  useEffect(() => { 
     try {
    const User = localStorage.getItem("user");
    /*🔁 Alternative:
Instead of accessing localStorage directly in multiple places, you can:
Create a utility function:
const getStoredUser = () => JSON.parse(localStorage.getItem("user"));
Or use Context API to manage the user globally in your app.
      */ 

   // console.log(User)
    const parseUser =  User ? JSON.parse(User) : null;
    /*  This converts the JSON string into a JavaScript object.
If the value in localStorage is "null" or invalid JSON, this will throw an error.
⚠️ earlier - JSON.parse(User)
    */

    setUserData(parseUser);

  } catch (e) {
    console.error("Failed to parse user:", e);
  }
  }, []);

  

  return (
    <>
      <div className="relative h-screen w-full flex items-center justify-center text-center bg-cover bg-center">

        <div className="absolute top-0 right-0 bottom-0 left-0 bg-gray-900 opacity-75"></div>

        <main className="px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center">

            <h2 className="text-4xl tracking-tight leading-10 font-medium sm:text-5xl text-white sm:leading-none md:text-6xl">
              <span className="text-indigo-600 font-bold">
                Hi {userData?.first_name} {userData?.last_name},
              </span>{" "}
              Welcome to my Blog Site!
            </h2>

            <p className="mt-3 text-white sm:mt-5 sm:text-md sm:max-w-xl sm:mx-auto md:mt-5">
              This is Under Development Blog Posting Site.
            </p>

            <div className="mt-5 sm:mt-8 sm:flex justify-center">

              <div className="rounded-md shadow">
                <Link to="/create"
                     className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-regular rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition duration-150 ease-in-out md:py-4 md:px-10"
                 >
                {/*  <a href="/create"  */}
                  Create Post
               {/*    </a>   */}
               </Link>
              </div>

              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Link to="/personal"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-regular rounded-md text-indigo-700 bg-indigo-100 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-300 transition duration-150 ease-in-out md:py-4 md:px-10"
                >         
                 View My Post
                </Link>
              </div>
              
            </div>

          </div>
        </main>

      </div>

      <BlogPost />

      {/* <div className="pt-10 text-3xl font-medium text-center">
        {loading ? "The System is logging you out" : "Welcome Home"}{" "}
        <span className="font-bold">
          {userData?.first_name} {userData?.last_name}
        </span>
      </div> */}

    </>
  );
};

export default Home;
