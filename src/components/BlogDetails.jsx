import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";

const BlogDetail = () => {
  const navigate = useNavigate();
  const [singlePost, setSinglePost] = useState();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar(); 

  useEffect(() => {
    const User = localStorage.getItem("user");

    if (!User) { 
      enqueueSnackbar("Please Login to view Blog Detail !", { variant: "warning" });   
      navigate("/login"); 
     return ;
    }
  }, []);

  const singleBlog = () => {
    axios
      .get(`/api/blogs/${id}`)
      .then(function (response) {
        setSinglePost(response?.data?.blogs);
       // console.log(response?.data?.blogs);
      })
      .catch(function (error) {
       enqueueSnackbar(error?.response?.data?.message, { variant: "error" }); 
       // console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  useEffect(() => {
    singleBlog();
  }, []);


  return (
    <div className="relative">
      <div className="max-w-3xl mb-10 rounded overflow-hidden flex flex-col mx-auto text-center">
        <div className="max-w-3xl mx-auto text-xl sm:text-4xl font-semibold inline-block hover:text-indigo-600 transition duration-500 ease-in-out inline-block mb-2">
          Detailed Blog 
        </div>

        <img className="w-full h-96 my-4" src={singlePost?.image} />
         <p className="text-gray-700 text-base leading-8 max-w-2xl mx-auto">
          Title : {singlePost?.title} 
        </p>
        <p className="text-gray-700 text-base leading-8 max-w-2xl mx-auto">
          Author: {singlePost?.user?.first_name} {singlePost?.user?.last_name}
        </p>

        <hr />
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="mt-3 bg-white rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal">
          <div className="">
            <p className="text-base leading-8 my-5">{singlePost?.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
