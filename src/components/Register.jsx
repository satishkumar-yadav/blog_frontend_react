import { useSnackbar } from "notistack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";

const Register = () => {
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar(); 


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  
  const onSubmit = (data) => {
    
   // console.log("Data",data);
    // return;
 
    setLoading(true);
    const body = {
      ...data,
      //phone: parseInt(data.phone),
    };

    axios
      .post("/auth/register",body) 
      .then(function (response) {
        const msg = response?.data?.message || "Registered successfully";
        setMessage(msg);
        enqueueSnackbar(msg, { variant: "success" }); // ✅ Show success toast
       // localStorage.setItem("user", JSON.stringify(response?.data?.user));
        //console.log(response?.data?.user);
        navigate("/login");
      })
      .catch(function (error) {
        const errorMsg = error?.response?.data?.message || "Registration failed";
        setMessage(errorMsg);
        enqueueSnackbar(errorMsg, { variant: "error" }); // ✅ Show error toast
        //console.log(error?.response?.data?.message);
       
      })
      .then(function () {  
        setLoading(false);
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
              <div className="relative text-gray-600 focus-within:text-gray-400">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
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
                </span>
                <input
                  type="text"
                  name="first_name"
                  className="py-2 border-b-2 text-sm rounded-md pl-10 focus:outline-none w-10/12 focus:bg-white focus:text-gray-900"
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

               {/* User ID */}
              <div className="pt-6 text-sm">User ID:</div>
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
                  name="userid"
                  className="py-2 border-b-2 text-sm rounded-md pl-10 focus:outline-none w-10/12 focus:bg-white focus:text-gray-900"
                  placeholder="Create a Unique User ID"
                  autoComplete="on"
                  {...register("user_id", {
                    required: true,
                  })}
                />
                <div>
                  {errors.userid && errors.userid.type === "required" && (
                    <span
                      role="alert"
                      className="text-red-600 text-[10px] italic"
                    >
                      User ID is required
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
                  disabled={loading}  //disabled={loading} -gpt {loading ? true : false}
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
