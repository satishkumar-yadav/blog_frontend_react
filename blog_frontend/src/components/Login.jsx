import axios from "axios";
import { useSnackbar } from "notistack"; // ✅ using notistack
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [message, setMessage] = useState();
  /*  useState() hook to store feedback messages from login (success/failure).
Initially undefined. You could initialize it with "" or null for safety.
*/

  const [loading, setLoading] = useState(false);
  /*  Controls the loading state (used to show a spinner or disable buttons while waiting for response).
  */

  const navigate = useNavigate();
/*  From React Router v6, this hook provides programmatic navigation.
navigate("/") redirects to home after login.
🔁 Alternative: In React Router v5, you would use useHistory().
*/

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
/*  ✅ useForm() from react-hook-form:
This powerful hook comes from the react-hook-form library:
Feature	          Description
register	       Registers input fields to be controlled by the form
handleSubmit	   Wraps your submit handler (onSubmit) and handles validations
watch	           Returns current value of inputs (like watch("email"))
errors	         Contains validation errors (e.g., errors.email)
🧠 React Hook Form improves performance by reducing re-renders, and it's less verbose than Formik or controlled components.
*/

  const options = {
    position: "bottom-right",
    style: {
      backgroundColor: "gray",
      border: "2px solid lightgreen",
      color: "white",
      fontFamily: "Menlo, monospace",
      fontSize: "20px",
      textAlign: "center",
    },
    closeStyle: {
      color: "lightcoral",
      fontSize: "16px",
    },
  };
/*  🧪 Snackbar Notification Options:
This object sets the toast/snackbar style.
Used by the useSnackbar() hook to customize messages shown to the user.
*/

  //const [openSnackbar, closeSnackbar] = useSnackbar(options);
    const { enqueueSnackbar } = useSnackbar(); // ✅ notistack hook
/*  🧯 Snackbar Initialization:
Custom hook (useSnackbar) that returns:
openSnackbar(message) — shows a toast
closeSnackbar() — hides it manually
The options defined above determine styling.
📦 Most likely comes from a UI library like react-simple-snackbar or a custom hook.
*/

  const onSubmit = (data) => {
/* 🧾 Submit Handler:
Called only when form validation passes.
data is the object containing all form values (e.g., { email: "abc", password: "123" }).
*/

    setLoading(true);
    /* 🛠️ Step-by-step inside onSubmit:
    Shows loading state to block UI or show spinner.
    */

    const body = {
      ...data,
      //phone: parseInt(data.phone),
    };
/*  Prepares the request body. In some cases, you may need to modify fields (like converting phone string to int). That's why phone: parseInt(data.phone) is commented.
*/

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/login`,
        { // email,
          // password,    //  ...body 
          // rememberMe, // 👈 send to backend 
          ...body
         },
        {
          withCredentials: true,
        }
        /* 📡 Axios POST request:
        Part	                            What it does
axios.post(url, data, config)	            Sends POST request
process.env.REACT_APP_BACKEND_URL	        Uses environment variable to keep URL secure and configurable
withCredentials: true	                    Ensures cookies (e.g., JWT tokens) are sent to the backend
{ ...body }	                              Sends form data as the request body
🛡️ withCredentials is required if you’re using HTTP-only cookies for secure login/session handling (e.g., JWT cookie stored on backend).
*/
      )
      .then(function (response) {
        // handle success
        setLoading(false);
        setMessage(response?.data?.message);
        //openSnackbar(response?.data?.message);
        enqueueSnackbar(response?.data?.message || "Login successful", {
          variant: "success",
        });
        localStorage.setItem("user", JSON.stringify(response?.data?.user));
        navigate("/");
        //console.log(response?.data?.message);
        /* ✅ .then() — on success:
        Line	                          Explanation
setLoading(false)	                      Stop showing loader
setMessage(...)	                        Show response message to user
openSnackbar(...)	                      Show a styled popup notification
localStorage.setItem("user", ...)	      Store user info locally for later (e.g., name on Home page)
navigate("/")	                          Redirect to home/dashboard after login
*/
      })
      .catch(function (error) {
        // handle error
        setLoading(false);
        //setMessage(error?.response?.data?.message);
        const errorMsg = error?.response?.data?.message || "Login failed";
        setMessage(errorMsg);
        //openSnackbar(error?.response?.data?.message);
         enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        //console.log(error?.response?.data?.message);
        /* ❌ .catch() — on error:
        Handles:
Network/server error
Invalid credentials
Backend form validation errors
*/
      })
      .then(function () {
        // always executed
        /* .then(function () { }) — finally block:
        This is an empty final block, executed whether success or failure.
Often used to clean up, like setLoading(false) (but already handled above).
*/
      });

    console.log(data);  // Debug : Logs submitted form values for debugging.
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
              <div className="pt-6 text-sm">Email:</div>
              <div className="relative text-gray-600 focus-within:text-gray-400">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <button
                    type="submit"
                    className="p-1 focus:outline-none focus:shadow-outline"
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                    >
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </button>
                </span>
                <input
                  type="email"
                  name="email"
                  className="py-2 border-b-2 text-sm rounded-md pl-10 focus:outline-none w-10/12 focus:bg-white focus:text-gray-900"
                  placeholder="Enter your Email Address"
                  autoComplete="on"
                  {...register("email", {
                    required: true,
                  })}
                />
                <div>
                  {errors.email && errors.email.type === "required" && (
                    <span
                      role="alert"
                      className="text-red-600 text-[10px] italic"
                    >
                      Email is required
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
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      class="w-4 h-4"
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
                  disabled={loading ? true : false}  // disabled={loading} -gpt
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
