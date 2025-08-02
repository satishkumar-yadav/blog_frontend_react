import { useSnackbar } from "notistack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios.js";

const Login = () => {
  const [message, setMessage] = useState();

  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const {  
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // const options = {
  //   position: "bottom-right",
  //   style: {
  //     backgroundColor: "gray",
  //     border: "2px solid lightgreen",
  //     color: "white",
  //     fontFamily: "Menlo, monospace",
  //     fontSize: "20px",
  //     textAlign: "center",
  //   },
  //   closeStyle: {
  //     color: "lightcoral",
  //     fontSize: "16px",
  //   },
  // };

  //const [openSnackbar, closeSnackbar] = useSnackbar(options);
    const { enqueueSnackbar } = useSnackbar(); 


  const onSubmit = (data) => {

    setLoading(true);
    
    const body = {
      ...data,
      //phone: parseInt(data.phone),
    };

    // axios
    //   .post(
    //     `${import.meta.env.VITE_BACKEND_URL}/api/login`,
    //     { // email,
    //       // password,    //  ...body 
    //       // rememberMe, // 👈 send to backend 
    //       ...body
    //      },
    //     {
    //       withCredentials: true,
    //     }
       
    //   )

  axios.post("/auth/login",body)
      .then(function (response) {
       // setLoading(false);
       // console.log( response)
        enqueueSnackbar(response?.data?.message || "Login successful", {variant: "success",});
       console.log(response?.data)
        localStorage.setItem("user", JSON.stringify(response?.data?.user));
        // Dispatch event to notify navbar about login change in same tab 
        window.dispatchEvent(new Event("loginStatusChange"));
        navigate("/");
                        
      })
      .catch(function (error) {
       // setLoading(false);
        console.log( error)
        const errorMsg = error?.response?.data?.message || "Login failed";
        setMessage(errorMsg);
         enqueueSnackbar(errorMsg, { variant: "error", });
        
      })
      .then(function () {
        setLoading(false);
        // always executed
        /* .then(function () { }) — finally block:
        This is an empty final block, executed whether success or failure.
Often used to clean up, like setLoading(false) (but already handled above).
*/
      });

   // console.log("Form Data: " ,data);  // Debug : Logs submitted form values for debugging.
  };


  return (
    <div className="bg-gradient-to-r min-h-screen lg:min-h-screen  from-cyan-500 to-blue-500">
      <div className="flex justify-center py-10 ">
        <div className="bg-white w-96 h-auto border border-gray-200 rounded-md">
          <h1 className="text-center pt-4 text-[#0c2650] text-lg font-bold">
            Login
          </h1>

          {message && (
            <div className="px-11 py-4">
              <div className="font-bold bg-gradient-to-r from-fuchsia-400 via-sky-400 to-violet-200 p-4  text-center text-white ">
                {message}
              </div>
            </div>
          )}

          <div className="pl-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="pt-6 text-sm">Email or User ID:</div>
              <div className="relative text-gray-600 focus-within:text-gray-400">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <button
                    type="submit"
                    className="p-1 focus:outline-none focus:shadow-outline"
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                    >
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </button>
                </span>
                <input
                  type="text"
                  name="user_id"
                  className="py-2 border-b-2 text-sm rounded-md pl-10 focus:outline-none w-10/12 focus:bg-white focus:text-gray-900"
                  placeholder="Enter your Email Address or User ID"
                  autoComplete="on"
                  {...register("user_id", {
                    required: true,
                  })}
                />
                <div>
                  {errors.user_id && errors.user_id.type === "required" && (
                    <span
                      role="alert"
                      className="text-red-600 text-[10px] italic"
                    >
                      Email or User ID is required
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-6 text-sm">Password:</div>
              <div className="relative text-gray-600 focus-within:text-gray-400">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <button
                    type="submit"
                    className="p-1 focus:outline-none focus:shadow-outline"
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                    >
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </button>
                </span>
                <input
                  type="password"
                  name="password"
                  className="py-2 border-b-2 text-sm rounded-md pl-10 focus:outline-none w-10/12 focus:bg-white focus:text-gray-900"
                  placeholder="Enter your password"
                  autoComplete="on"
                  {...register("password", {
                    required: true,
                  })}
                />
                 
                 { /*      
                 <input
                   type="checkbox"
                   checked={rememberMe}
                   onChange={(e) => setRememberMe(e.target.checked)}
                />
                */}

                <div>
                  {errors.password && errors.password.type === "required" && (
                    <span
                      role="alert"
                      className="text-red-600 text-[10px] italic"
                    >
                      Password is required
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right p-3 text-[#0c2650] text-sm">
                Forget Password?
              </div>

              <div className="py-6 px-6">
                <button
                  className={`w-full ${
                    loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700 "
                  } text-white font-bold py-2 px-4 rounded`}
                  disabled={loading}  // disabled={loading} -gpt {loading ? true : false}
                >
                  {loading ? "Loading..." : "Login"}
                </button>

                <div className="text-center text-sm pt-1">
                  Create an account? <Link to="/register">Sign Up</Link>
                </div>
              </div>
            </form>
            {/* <div class="flex justify-center items-center">
              <div
                class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
                role="status"
              >
                <span class="visually-hidden">Loading...</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
