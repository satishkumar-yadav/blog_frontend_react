import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";

const BlogPost = () => {
  const [blogData, setBlogData] = useState();
  const [loading, setLoading] = useState(false);
   const { enqueueSnackbar } = useSnackbar(); 

  const allBlog = () => {
    setLoading(true);
    axios
      .get("/api/blogs")
      .then(function (response) {
        setLoading(false);
        setBlogData(response?.data?.blogs);
       // console.log(response?.data);
        //console.log("Blog Data Set", blogData);
      })
      .catch(function (error) {
        setLoading(false);
        enqueueSnackbar(error?.response?.data?.message, { variant: "error" });
        // console.log(error);
      });
  };

  useEffect(() => {
    allBlog();
  }, []);

  return (
    <>
      {loading && (
        <div className="text-2xl font-bold text-center px-56 pt-24">
          <h1>LOADING.....</h1>
        </div>
      )}

      {/*  Blog Cards Layout  */}
      <div className="container my-12 mx-auto px-4 md:px-12">
        <div className="flex flex-wrap -mx-1 lg:-mx-4">

          {/*  Mapping Blog Posts  */}
          {blogData?.map((blog) => (
            <div key={blog.ID} className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">

                {/*  Each Blog Card  */}
              <article className="overflow-hidden rounded-lg shadow-lg">
                <Link to={`/blogs/${blog.ID}`}>
                  <img
                    alt="Placeholder"
                    className="block h-72 w-full"
                    src={blog?.image}
                  />
                </Link>

                 {/*  Card Content */}
                <header className="flex items-center justify-between leading-tight p-2 md:p-4">
                  <h1 className="text-lg">
                    <Link
                      className="no-underline hover:underline text-black"
                      to={`/blogs/${blog.ID}`}
                    >
                      {blog.title}
                    </Link>

                  </h1>
                  <p className="text-grey-darker text-sm">
                    {new Date(blog?.CreatedAt).toLocaleString()}
                  </p>
                </header>

                 {/*  Author Info */}
                <footer className="flex items-center justify-between leading-none p-2 md:p-4">
                  <Link
                    className="flex items-center no-underline hover:underline text-black"
                    to={`/blogs/${blog.ID}`}
                  >
                    <img
                      alt="Placeholder"
                      className="block rounded-full w-5 h-5"
                      src={blog?.image}
                    />
                    <p className="ml-2 text-sm">
                      {blog?.user?.first_name} {blog?.user?.last_name}
                    </p>
                  </Link>

                  <Link
                    className="no-underline text-grey-darker hover:text-red-dark"
                    to="#"
                  >
                    <span className="text-rose-600">Like</span>
                    <i className="fa fa-heart"></i>
                  </Link>
                </footer>

              </article>


            </div>
          ))}

          
        </div>
      </div>
    </>
  );
};
export default BlogPost;
