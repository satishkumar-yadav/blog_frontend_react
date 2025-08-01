import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import uploadimage from "../assets/upload-image.svg";

const EditPost = () => {
  const [singlePost, setSinglePost] = useState();
  const [loading, setLoading] = useState(false);
  const [imgUpdated, setImgUpdated] = useState(false);  // true after imgData has uploaded filename
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState();
  const [imageUpload, setImageUpload] = useState();  //changed image file to upload
  const [imageData, setImageData] = useState();   // uploaded filename
  const { enqueueSnackbar } = useSnackbar(); 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const singleBlog = () => {
    axios
      .get(`/api/myblogs/${id}`)
      .then(function (response) {
        setSinglePost(response?.data?.blogs);
        //console.log(response?.data?.blogs);
      })
      .catch(function (error) {
       // console.log(error);
        enqueueSnackbar(error?.response?.data?.message, { variant: "error" }); // ❗ Error fetch feedback
      
      })
      .then(function () {
        // always executed in all above steps
        //setLoading(false);
      });
  };

  useEffect(() => {
    const User = localStorage.getItem("user");

    if (!User) { 
     // enqueueSnackbar("Please login first to edit Post", { variant: "error" }); 
      navigate("/login");
    }
    singleBlog();
  }, []);

 
const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUpload(file);
     setImgUpdated(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage({ [e.target.name]: reader.result });
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const onSubmit = (data) => {
  setLoading(true);

   let imgToSend;

  if (imgUpdated) {
    if (!imageData) {
      enqueueSnackbar("Please upload updated image first", { variant: "error" });
      setLoading(false); // Reset loading if early return
      return;
    }
    imgToSend = imageData;
  } else {
    imgToSend = singleBlog?.image;
  }

    const body = {
      ...data,   
      image: imgToSend,   
     // image: singleBlog?.image,   
    }; 

    axios
      .put(`/api/update-blog/${id}`,body)
      .then(function (response) {
        setLoading(false);
        //console.log(response?.data);
        enqueueSnackbar( response?.data?.message ||"Post Updated Successfully", { variant: "success" });
        navigate("/personal");
      })
      .catch(function (error) {
        setLoading(false);
        enqueueSnackbar( error?.response?.data?.message || "Oops! Post update failed", { variant: "error" });
       // console.log(error);
      });
  };

   const uploadImage = () => {
    if (!imageUpload) {
      enqueueSnackbar("Please select updated image first", { variant: "warning" });
      return;
    }
    let formData = new FormData(); //formdata object

    formData.append("image", imageUpload); //append the values with key, value pair
    formData.append("name", imageUpload.name);

    const config = {
      headers: { "content-type": "multipart/form-data" },
      withCredentials: true,
    };
    let url = `${import.meta.env.VITE_BACKEND_URL}/api/upload-image`;

    axios
      .post(url, formData, config)
      .then((response) => {
        setImageData(response?.data?.filename);
        enqueueSnackbar(response?.data?.message , { variant: "success" });
      })
      .catch((error) => {
        enqueueSnackbar(error?.response?.data?.message , { variant: "error" });
      })
      .finally(() => /* setLoadingData(false) */ console.log() ) ; 

  };

  return (
    <div className="max-w-screen-md mx-auto p-5">
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
              defaultValue={singlePost?.title}
              {...register("title", {
                required: true,
              })}
            />
            {errors.title && errors.title.type === "required" && ( 
              <p className="text-red-500 text-xs italic">
                Please enter a title.
              </p>
            )}
          </div>
        </div>

         {/* Image (Display only) */}
        <div className="flex flex-wrap -mx-3 items-center lg:items-start mb-6">
          <div className="w-full px-3">
            <label title="click to select a picture">
              <input
                accept="image/*"
                className="hidden"
                id="banner"
                type="file"
                name="image"
                onChange={handleImage}
                visibility="hidden"
              />
              <div className="flex flex-col">
                <div className="pb-2">Upload Image</div>

                {image || singlePost ? (
                  <div className="pt-4">
                    <div>
                      <img
                        className="-object-contain -mt-8 p-5 w-1/2"
                        src={image ? image.image : singlePost?.image}
                        alt="preview"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="pb-5">
                    <img
                      src={uploadimage}
                       alt="preview"
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
          <div className="flex items-center justify-cente px-5">
            <button
              className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded"
              type="button"

              onClick={uploadImage}
            >
              update image
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
              name="desc"
              defaultValue={singlePost?.description}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              {...register("description", {
                required: true,
              })}
            ></textarea>
            {errors.desc && errors.desc.type === "required" && (
              <p className="text-red-500 text-xs italic">
                Description is required.
              </p>
            )}
          </div>
        </div>
          
           {/* Submit */}
          <div className="flex justify-between w-full px-3">
            <button
              className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded"
              type="submit"
            >
              {loading ? "Updating..." : " Update Post"}
            </button>
          </div>

      </form>
    </div>
  );
};
export default EditPost;
