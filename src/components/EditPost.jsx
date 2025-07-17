import axios from "axios";
import { useSnackbar } from "notistack"; // ✅ Switched to notistack
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const EditPost = () => {
  const [singlePost, setSinglePost] = useState();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

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
const { enqueueSnackbar } = useSnackbar(); // ✅ Use notistack's hook

  const singleBlog = () => {
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-blog/${id}`,
        //{},
        {
          withCredentials: true,
        }
      )
      .then(function (response) {
        //setLoading(false);
        //setBlogData(response?.data?.data);
        setSinglePost(response?.data?.data);
        console.log(response?.data?.data);
      })
      .catch(function (error) {
        // handle error
        //setLoading(false);
        //   setMessage(error?.response?.data?.message);
        //   openSnackbar(error?.response?.data?.message);
        console.log(error);
         enqueueSnackbar("Failed to fetch post details", { variant: "error" }); // ❗ Error fetch feedback
      
      })
      .then(function () {
        // always executed
      });
  };

  useEffect(() => {
    const User = localStorage.getItem("user");

    if (!User) {
      navigate("/login");
    }
    singleBlog();
  }, []);

  const onSubmit = (data) => {
    setLoading(true);
    const body = {
      ...data,
      image: singleBlog?.image,   // image: singlePost?.image, -gpt
    };

    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/api/update-blog/${id}`,
        { ...body },
        {
          withCredentials: true,
        }
      )
      .then(function (response) {
        //console.log(response?.data);
        //openSnackbar("Post Updated Successfully");
        enqueueSnackbar("Post Updated Successfully", { variant: "success" });
        setLoading(false);
        navigate("/personal");
      })
      .catch(function (error) {
        //openSnackbar("Oops!, Post is not updated");
        enqueueSnackbar("Oops! Post update failed", { variant: "error" });
        setLoading(false);

        // handle error
        //setLoading(false);
        //   setMessage(error?.response?.data?.message);
        //
        //console.log(error);
      });
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
                Please fill out this field. -  Please enter a title.
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
                //onChange={handleImage}
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
                      src="/upload-image.svg"
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
              // type="submit"
              //onClick={uploadImage}
            >
              upload image
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
              defaultValue={singlePost?.desc}
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
            >
              {loading ? "Updating..." : " Update Post"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default EditPost;
