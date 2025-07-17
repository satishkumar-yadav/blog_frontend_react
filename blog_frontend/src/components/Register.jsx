import axios from "axios";
import { useSnackbar } from "notistack"; // ✅ Switched to notistack
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
/* ✅ What this does:
Declares a React functional component.
message: holds feedback messages from the server (success or error).
loading: tracks whether the form is being submitted (can show a spinner or disable button).
💡 Suggestions:
Initialize message as "" or null to prevent potential warnings.
Use useReducer if managing more complex form state.
*/

  const navigate = useNavigate();
/* From React Router v6.
Allows programmatic redirection (e.g., after successful registration, go to login page).
*/

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
/* ✅ 3. Form Hook (react-hook-form)
📌 Explanation:
Hook / Property	     Purpose
register	           Binds input fields to form control
handleSubmit	       Wraps your onSubmit to handle validation
watch	               Watches value changes in real-time (can be used for live validation)
errors	             Holds validation error messages per field
*/

// gpt removed options
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
/* ✅ 4. Snackbar Options
These are style configs for a toast/snackbar component.
*/

 // const [openSnackbar] = useSnackbar(options);
   const { enqueueSnackbar } = useSnackbar(); // ✅ Snackbar hook
/* ✅ 5. Snackbar Hook
Initializes the snackbar using the above options.
openSnackbar(msg) will show the styled message.
closeSnackbar() is not destructured here, so it's not available.
*/

// ❗ 6. Submit Handler (core logic)
  const onSubmit = (data) => {
    
    console.log("Data",data);
  //  return;
    
    setLoading(true);
    const body = {
      ...data,
      //phone: parseInt(data.phone),
    };
/*  setLoading(true) – activates loading state
body object created by spreading form fields
Comment hints at converting phone to number using parseInt
*/

// 📡 Axios Request to Backend:
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/register`, { ...body } ,{
          withCredentials: true,
        })
      /* Part	                           What it does
axios.post	                             Sends a POST request with form data to the backend
process.env.REACT_APP_BACKEND_URL	       Reads the backend base URL from .env
{ ...body }	                             Sends form values like { first_name, last_name, email, password, ... }
🧠 If you’re using cookie-based auth or CSRF tokens, you’d also add:
{ withCredentials: true }
 */
      .then(function (response) {
        // handle success
        setLoading(false);
       // setMessage(response?.data?.message);
       // openSnackbar(response?.data?.message);
        const msg = response?.data?.message || "Registered successfully";
        setMessage(msg);
        enqueueSnackbar(msg, { variant: "success" }); // ✅ Show success toast
        localStorage.setItem("user", JSON.stringify(response?.data?.user));
        
        //console.log(response?.data?.user);
        navigate("/login");
        /* ✅ .then() — on Success:
        Line	                          Action
setLoading(false)	                      Stop the loading indicator
setMessage()	                          Store the success message
openSnackbar()	                        Show toast to user
localStorage.setItem("user", ...)	      Save user data locally (not ideal for sensitive info)
navigate("/login")	                    Redirect to login page
*/
      })
      .catch(function (error) {
        // handle error
        
       // setMessage(error?.response?.data?.message);
       // openSnackbar(error?.response?.data?.message);
        const errorMsg = error?.response?.data?.message || "Registration failed";
        setMessage(errorMsg);
        enqueueSnackbar(errorMsg, { variant: "error" }); // ✅ Show error toast
      setLoading(false);
        //console.log(error?.response?.data?.message);
        /* ❌ .catch() — on Error:
        Catches and handles server errors (like duplicate email, validation errors, etc.)
Prevents app from crashing and provides user feedback
*/
      })
      .then(function () {  // 🔁 .then(function () {}) — Finally Block
        // always executed
        // Empty final block. Use this if you want to ensure some action happens regardless of success or failure.
      });

    //console.log(data);
  };
  return (
    <div className="bg-gradient-to-r min-h-screen lg:min-h-screen  from-cyan-500 to-blue-500">
      <div className="flex justify-center py-10 ">
        <div className="bg-white w-96 h-auto border border-gray-200 rounded-md">
          <h1 className="text-center pt-4 text-[#0c2650] text-lg font-bold">
            Sign up
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
               {/* First Name */}
              <div className="text-sm">First Name</div>
              <div class="relative text-gray-600 focus-within:text-gray-400">
                <span class="absolute inset-y-0 left-0 flex items-center pl-2">
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
                </span>
                <input
                  type="text"
                  name="first_name"
                  class="py-2 border-b-2 text-sm rounded-md pl-10 focus:outline-none w-10/12 focus:bg-white focus:text-gray-900"
                  placeholder="Enter your first name"
                  autoComplete="on"
                  {...register("first_name", {required: true, })}
                />

                <div>
                  {errors.first_name && errors.first_name.type === "required" && (
                    <span
                      role="alert"
                      className="text-red-600 text-[10px] italic"
                    >
                      First Name is required
                    </span>
                  )}
                </div>
              </div>

              {/* Last Name */}
              <div className="pt-6 text-sm">Last Name:</div>
              <div class="relative text-gray-600 focus-within:text-gray-400">
                <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                  <button
                    type="submit"
                    class="p-1 focus:outline-none focus:shadow-outline"
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
                  type="text"
                  name="last_name"
                  className="py-2 border-b-2 text-sm rounded-md pl-10 focus:outline-none w-10/12 focus:bg-white focus:text-gray-900"
                  placeholder="Enter your last name"
                  autoComplete="on"
                  {...register("last_name", {
                    required: true,
                  })}
                />
                <div>
                  {errors.last_name && errors.last_name.type === "required" && (
                    <span
                      role="alert"
                      className="text-red-600 text-[10px] italic"
                    >
                      Last Name is required
                    </span>
                  )}
                </div>
              </div>

               {/* Email */}
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

               {/* Password */}
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

              {/* Phone */}
              <div className="pt-6 text-sm">Phone No:</div>
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
                  type="number"
                  name="phone"
                  className="py-2 border-b-2 text-sm rounded-md pl-10 focus:outline-none w-10/12 focus:bg-white focus:text-gray-900"
                  placeholder="Enter your phone number"
                  autoComplete="on"
                  {...register("phone", {
                    required: true,
                  })}
                />
                <div>
                  {errors.phone && errors.phone.type === "required" && (
                    <span
                      role="alert"
                      className="text-red-600 text-[10px] italic"
                    >
                      Phone No is required
                    </span>
                  )}
                </div>
              </div>  

               {/* Submit */}
              <div className="py-6 px-6">
                <button
                  className={`w-full ${
                    loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700 "
                  } text-white font-bold py-2 px-4 rounded`}
                  disabled={loading ? true : false}  //disabled={loading} -gpt
                >
                  {loading ? "Registering..." : "Register"}
                </button>

                <div className="text-center text-sm pt-1">
                  Already have an account? <Link to="/login">Login</Link>
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

export default Register;
