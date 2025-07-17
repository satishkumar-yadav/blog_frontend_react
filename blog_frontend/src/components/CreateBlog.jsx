import axios from "axios";
import { useSnackbar } from "notistack"; // ✅ Using notistack
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState();
  const [imageUpload, setImageUpload] = useState();
  const [userData, setUserData] = useState();
  const [loadingData, setLoadingData] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const User = localStorage.getItem("user");
    const parseUser = JSON.parse(User);
    setUserData(parseUser);
    if (!User) {
      navigate("/login");
    }
  }, []);

  /*
  //gpt
  useEffect(() => {
    const User = localStorage.getItem("user");
    if (!User) {
      navigate("/login");
      return;
    }
    setUserData(JSON.parse(User));
  }, []);
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

  //const [openSnackbar] = useSnackbar(options);
  const { enqueueSnackbar } = useSnackbar(); // ✅ Snackbar from notistack

  const onSubmit = (data) => {
    setLoading(true);

    const body = {
      ...data,
      image: imageData,
      userid: userData.id,

      //phone: parseInt(data.phone),
    };

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/create-blog`,  ///api/create-blog
        { ...body },
        {
          withCredentials: true,
        }
      )
      .then(function (response) {
        // handle success
        enqueueSnackbar("Post created successfully", { variant: "success" });
        // setLoading(false);   // gpt removed
        navigate("/home");
      })
      .catch(function (error) {
        enqueueSnackbar("Post creation failed", { variant: "error" });
        // setLoading(false);  //gpt removed
      })
      .then(function () {
        // always executed
         setLoading(false);
      });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    const size = file.size / 1024;
    setImageUpload(e.target.files[0]);

    // data.append("image", file);
    const reader = new FileReader();
    reader.onloadend = function () {
      setImage({ [e.target.name]: reader.result });

      //setPreview({ ...preview, [e.target.name]: reader.result });
    };
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      e.target.value = null;
    }
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
    let formData = new FormData(); //formdata object

    formData.append("image", imageUpload); //append the values with key, value pair
    //formData.append("name", imageUpload.name);
    formData.append("name", imageUpload.name);

    /*
    // gpt alternative
    const uploadImage = () => {
    if (!imageUpload) {
      enqueueSnackbar("Please select an image first", { variant: "warning" });
      return;
    }

    setLoadingData(true);
    const formData = new FormData();
    formData.append("image", imageUpload);
    formData.append("name", imageUpload.name);

    axios
    */

    const config = {
      headers: { "content-type": "multipart/form-data" },
      withCredentials: true,
    };
    let url = `${import.meta.env.VITE_BACKEND_URL}/api/upload-image`;

    axios
      .post(url, formData, config)
      /*  gpt
       .post(`${process.env.REACT_APP_BACKEND_URL}/api/upload-image`, formData, {
        headers: { "content-type": "multipart/form-data" },
        withCredentials: true,
      })
        */
      .then((response) => {
        setLoadingData(false);
        setImageData(response?.data?.url);
       // openSnackbar("Image uploaded successfully");
        enqueueSnackbar("Image uploaded successfully", { variant: "success" });
      })
      .catch((error) => {
        enqueueSnackbar("Image upload failed", { variant: "error" });
        setLoadingData(false);
        console.log(error);
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

           {/* Image Upload */}
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
                        src="/upload-image.svg"
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

            <div className="flex items-center justify-cente px-5">
              <button
                className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded"
                // type="submit"
                onClick={uploadImage}
                disabled={loading ? true : false}    //disabled={loadingData}-gpt
              >
                {loading ? "Uploading..." : " upload image"}
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
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                {...register("desc", {
                  required: true,
                })}
              ></textarea>

              {errors.desc && errors.desc.type === "required" && (
                <p className="text-red-500 text-xs italic">
                  Description is required.
                </p>
              )}
            </div>

              {/* Submit */}
            <div className="flex justify-between w-full px-3">
              <button
                className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded"
                type="submit"
                disabled={loading ? true : false}
              >
                {loading ? "Creating..." : "Create Post"}
              </button>
            </div>
          </div>

        </form>

      </div>

    </>
  );
};

export default CreateBlog;
