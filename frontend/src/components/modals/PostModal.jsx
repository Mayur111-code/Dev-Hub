import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import PostCard from "../cards/PostCard";

export default function PostModal({ post, close, refresh }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Post Details
          </h2>
          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-all duration-200 shadow-sm"
            onClick={close}
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-80px)] overflow-y-auto">
          <div className="p-6">
            <PostCard post={post} refresh={refresh} />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={close}
            className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}