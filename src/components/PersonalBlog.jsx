//import axios from "../api/axios";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const PersonalBlog = () => {
  const [blogData, setBlogData] = useState();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar(); 

   useEffect(() => {
    const User = localStorage.getItem("user");  
    if (!User) {
      enqueueSnackbar("Please Login First to view Your Blog", {variant: "warning",}); 
      navigate("/login");
       return ;
    }
    uniqueBlog();
  }, []);
 
   

  const uniqueBlog = () => {
    setLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/api/myblogs`,

        {
          withCredentials: true,
          headers: {
            Authorization: "TOKEN",
          },
        }
      )
      .then(function (response) {
        setBlogData(response?.data.blogs);
        //console.log(response?.data);
      })
      .catch(function (error) {
        enqueueSnackbar(error?.response?.data?.message || "Error fetching blogs", {variant: "error", });
      
      })
      .then(function () {
         setLoading(false);
        // always executed
      });
  };

 
  const deleteBtn = (blog) => {
    setDeleteLoading(true);
    axios
      .delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/delete-blog/${blog.ID}`,

        {
          withCredentials: true,
        }
      )
      .then(function (response) {
        enqueueSnackbar(response?.data?.message || "Blog deleted successfully", {variant: "success",});
        
        uniqueBlog();

       // console.log(response?.data);
      })
      .catch(function (error) {
        enqueueSnackbar(error?.response?.data?.message || "Delete failed", { variant: "error", });
      
      })
      .then(function () {
        setDeleteLoading(false);
      });
  };

  return (
    <>
       {!loading && blogData?.length <= 0 && (
        <div className="text-2xl font-bold text-center flex justify-center items-center pl-16 pt-24">
          <h1>You don't have post yet. Kindly create a post </h1>
        </div>
      )}

      {loading && (
        <div className="text-2xl font-bold text-center px-56 pt-24">
          <h1>LOADING.....</h1>
        </div>
      )}

      
      <div className="container my-12 mx-auto px-4 md:px-12">
        <div className="flex flex-wrap -mx-1 lg:-mx-4">
          {blogData?.map((blog) => (
            <div key={blog.ID} className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">

              <article className="overflow-hidden rounded-lg shadow-lg">
                <Link to ={`/blogs/${blog.ID}`}>
                  <img
                    alt="Blog"
                    className="block h-72 w-full object-cover"
                    src={blog?.image}
                  />
                </Link>

                <header className="flex items-center justify-between leading-tight p-2 md:p-4">
                  <h1 className="text-lg">
                    <Link
                      className="no-underline hover:underline text-black"
                      to ={`/blogs/${blog.ID}`}
                    >
                      {blog.title}
                    </Link>
                  </h1>
                  <p className="text-grey-darker text-sm">
                    {new Date(blog?.CreatedAt).toLocaleString()}
                  </p>
                </header>

                <footer className="flex items-center justify-between leading-none p-2 md:p-4">
                  <Link
                    className="flex items-center no-underline hover:underline text-black"
                    to ={`/blogs/${blog.ID}`}
                  >
                    <img
                      alt="Author"
                      className="block rounded-full w-5 h-5"
                      src={blog?.image}
                    />
                    <p className="ml-2 text-sm">
                      {blog?.user?.first_name} {blog?.user?.last_name}
                    </p>
                  </Link>

                  <div>
                    <button
                      onClick={() => deleteBtn(blog)}
                      disabled={deleteLoading}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      {deleteLoading ? "Loading" : "Delete"}
                    </button>
                  </div>
                  <div className="">
                    <Link to={`/edit/${blog.ID}`}>
                      <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                        Edit
                      </button>
                    </Link>
                  </div>
                </footer>

              </article>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PersonalBlog;
