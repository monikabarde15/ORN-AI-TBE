import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import HeroBanner from "./components/Banner";
import { useRoute, Link } from "wouter";
import { Shell } from "@/components/layout/Shell";
import api from "../../services/api";

export default function BlogDetail() {
  const [, params] = useRoute("/blogs/:id");
const id = params?.id;
console.log("Blog ID:", id);
const [blog, setBlog] = useState<any>(null);
const [loading, setLoading] = useState(true);
  // ✅ Static blog data array
  
useEffect(() => {
  if (!id) return;

  const fetchBlog = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/api/blogs/${id}`);

      console.log(response.data);

      setBlog(response.data.data);
    } catch (error) {
      console.error("Blog fetch error:", error);
      setBlog(null);
    } finally {
      setLoading(false);
    }
  };

  fetchBlog();
}, [id]);
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  );
}
  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#0b0718]">
        <p className="text-lg mb-3">⚠️ Blog not found.</p>
        <Link
          to="/blogs"
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#7c4dff] to-[#3f95ff] hover:from-[#9063ff] hover:to-[#66b9ff] transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          ← Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <>
    <Shell>
      <HeroBanner
          title={blog.title}
          subtitle="Your subtitle or description goes here"
          ctaText="Sign up"
          ctaHref="/signup"
          image="https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/668baff40b223db5311c7fda_network-connections.png"
          height="h-96"
          />
          <div className="text-gray-500 mb-6">
  {new Date(blog.createdAt).toLocaleDateString()}
</div>
      <div className="min-h-screen bg-[#fff] text-white py-20 px-5 md:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          {/* Image */}
          <div className="relative overflow-hidden rounded-2xl mb-8 group shadow-lg shadow-[#fff]">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
              src={blog?.thumbnail}
              alt={blog.title}
              className="rounded-2xl w-full object-cover max-h-[500px] transition-transform duration-700 group-hover:brightness-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0718]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Title */}
        

          {/* Blog Content */}
          <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  className="prose prose-lg max-w-none text-black"
  dangerouslySetInnerHTML={{
  __html: blog.description || ""
}}
/>

          
          {/* Back Button */}
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/blogs"
              className="inline-block px-6 py-3 rounded-full bg-[linear-gradient(90deg,#170d3e_30%,#080e1f_100%)]  font-medium text-white"
            >
              ← Back to Blogs
            </Link>
          </motion.div>
        </motion.div>
      </div>
      </Shell>
    </>
  );
}
