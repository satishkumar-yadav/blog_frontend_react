import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import uploadimage from "../assets/upload-image.svg";

const CreateBlog = () => {
  const [image, setImage] = useState();  // read image from imageUpload - file  // for displaying
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState();  // uploaded image filename
  const [imageUpload, setImageUpload] = useState();  // image file to upload
  const [userData, setUserData] = useState({}); 
  const [loadingData, setLoadingData] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar(); 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
 
  useEffect(() => {
    try {
    const User = localStorage.getItem("user");
     if (!User) {
      enqueueSnackbar("Please login to Create Post !", { variant: "warning" }); 
      navigate("/login");
      return ;
    }

    const parseUser =  User ? JSON.parse(User) : null;
    setUserData(parseUser);
    //setUserData(JSON.parse(User));

    // console.log("U data: ",User);
    // console.log("Parse User data: ",parseUser);
    // console.log("Parse User Id : ",parseUser.user_id);
    // console.log("user data : ",userData);
   
    } catch (e) {
    console.error("Failed to parse user:", e);
  }
    
  }, []);
 
//   useEffect(() => {
// console.log("userData changed:", userData);
// }, [userData]);

  //console.log("user data outside : ",userData);
 // console.log("user id : ",userData.user_id);

  const onSubmit = (data) => {

     if (!imageData) {
      enqueueSnackbar("Please upload an image first", { variant: "warning" });
      return;
    }

    setLoading(true);

    const body = {
      ...data,
      image: imageData,
      user_id: userData.user_id,

      //phone: parseInt(data.phone),
    };

    // console.log("Submitted form ")
    // console.log("data: ",data)
    // console.log("Body data: ",body)

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/create-blog`,  
        { ...body },
        {
          withCredentials: true,
        }
      )
      .then(function (response) {
        enqueueSnackbar(response?.data?.message , { variant: "success" });
        // setLoading(false);   // gpt removed
        navigate("/personal");
      })
      .catch(function (error) {
        enqueueSnackbar(error?.response?.data?.message, { variant: "error" });
        // setLoading(false);  //gpt removed
      })
      .then(function () {
        // always executed
         setLoading(false);
      });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    const size = file.size / 1024; // size in KB

    //console.log("hadle image runing")

    if (size > 2048) { // 2MB limit
       // setErrorMessage("File size exceeds 2MB. Please upload an image smaller than 2MB.");
      // alert("Please upload image with size <2 MB")
        enqueueSnackbar("Please upload image with size <2 MB" , { variant: "error" });
        setImageUpload(null); // Clear any previous uploads
      //  setImage(null); // Clear any previous image preview
        e.target.value = null; // Reset file input
        return; // Stop further processing
    }

    //setErrorMessage(""); // Clear previous error if any
    setImageUpload(file);
   // setImageUpload(e.target.files[0]);

    // data.append("image", file);
    const reader = new FileReader();
    reader.onloadend = function () {
      setImage({ [e.target.name]: reader.result });

      //setPreview({ ...preview, [e.target.name]: reader.result });
    };

    if (file) {
        reader.readAsDataURL(file);
        e.target.value = null;
    }
 
    // if (e.target.files[0]) {
    //   reader.readAsDataURL(e.target.files[0]);
    //   e.target.value = null;
    // }
  };

  /*
  //above alternative by gpt
 const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUpload(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage({ [e.target.name]: reader.result });
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };
  */

  const uploadImage = () => {
    if (!imageUpload) {
      enqueueSnackbar("Please select an image first", { variant: "warning" });
      return;
    }

  //  console.log("Upload image clicked")
  //  console.log("Upload image data : ", imageUpload)
0
    let formData = new FormData(); //formdata object

    formData.append("image", imageUpload); //append the values with key, value pair
    //formData.append("name", imageUpload.name);
    formData.append("name", imageUpload.name);

    const config = {
      headers: { "content-type": "multipart/form-data" },
      withCredentials: true,
    };
    let url = `${import.meta.env.VITE_BACKEND_URL}/api/upload-image`;

    // console.log("Form data : ", formData)
    // console.log("config data : ", config)
    // console.log("url data : ", url)

    axios
      .post(url, formData, config)
      /*  gpt
       .post(`${process.env.REACT_APP_BACKEND_URL}/api/upload-image`, formData, {
        headers: { "content-type": "multipart/form-data" },
        withCredentials: true,
      })
        */
      .then((response) => {
       // setImageData(response?.data?.image_url);
        setImageData(response?.data?.filename);
       // console.log("response data",response?.data)
        enqueueSnackbar(response?.data?.message , { variant: "success" });
      })
      .catch((error) => {
        enqueueSnackbar(error?.response?.data?.message , { variant: "error" });
        // console.log(error);
        // console.log(error?.response);
      })
      .finally(() => setLoadingData(false)); 

  };

  return (
    <>
      <div className="max-w-screen-md mx-auto p-5">

        <div className="text-center mb-16">
          <p className="mt-4 text-sm leading-7 text-gray-500 font-regular uppercase">
            Create your Blog
          </p>

          <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-900">
            Express your <span className="text-indigo-600">Feelings</span>
          </h3>
        </div>

        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>

          {/* Title */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-full px-3 mb-6 md:mb-0">

              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Title
              </label>

              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-first-name"
                type="text"
                placeholder="title"
                name="title"
                autoComplete="off"
                {...register("title", {
                  required: true,
                })}
              />

              {errors.title && errors.title.type === "required" && (
                <p className="text-red-500 text-xs italic">
                  Title is required.
                </p>
              )}
            </div>
          </div>

           {/* Image */}
          <div className="flex flex-wrap -mx-3 items-center lg:items-start mb-6">

            <div className="w-full px-3">

                 {/* Image Label */}
              <label title="click to select a picture">

               {/* Image Input */}
                <input
                  accept="image/*"
                  className="hidden"
                  id="banner"
                  type="file"
                  name="image"
                  onChange={handleImage}
                  visibility="hidden"
                />

                  {/* Image Box */}
                <div className="flex flex-col">
                  <div className="pb-2">Upload Image</div>

                  {image ? (
                    <div className="pt-4">
                      <div>
                        <img
                          className="-object-contain -mt-8 p-5 w-1/2"
                          src={image ? image.image : ""}
                          alt="preview"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="pb-5">
                      <img
                        src={uploadimage}
                        alt="upload placeholder"
                        style={{ background: "#EFEFEF" }}
                        className="h-full w-48"
                      />
                    </div>
                  )}
                </div>
              </label>

              {/* <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-email"
                type="file"
                name="image"
                onChange={handleImage}
              /> */}
            </div>

              {/* Image Upload Button */}
            <div className="flex items-center justify-cente px-5">
              <button
                className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded"
               // type="submit"  
                /* By default, in a <form>,
               A <button> without a type attribute acts as a submit button (type="submit").
                That means, when it’s clicked, it triggers the form’s onSubmit (in your case, handleSubmit(onSubmit)).  */
                type="button"         // <-- Prevents form submission 
                onClick={uploadImage}
                disabled={loadingData}    //disabled={loadingData}-gpt
              >
                {loadingData ? "Uploading..." : " upload image"}
              </button>
            </div>

          </div>

           {/* Description */}
          <div className="flex flex-wrap -mx-3 mb-6">

            <div className="w-full px-3">

              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Description
              </label>

              <textarea
                rows="10"
                name="description"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                {...register("description", {
                  required: true,
                })}
              ></textarea>

              {errors.description && errors.description.type === "required" && (
                <p className="text-red-500 text-xs italic">
                  Description is required.
                </p>
              )}
            </div>

              {/* Submit */}


          </div>
      

           {/* Submit */}
            <div className="flex justify-between w-full px-3">
              <button
                className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded"
                type="submit"
              
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Post"}
              </button>
            </div>


        </form>

      </div>

    </>
  );
};

export default CreateBlog;
