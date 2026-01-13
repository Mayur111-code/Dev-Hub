import { useState } from "react";
import API from "../../api/axios";
import { AiOutlineClose, AiOutlinePicture, AiOutlineVideoCamera } from "react-icons/ai";

export default function EditPostModal({ post, close, refresh }) {
  const [content, setContent] = useState(post.content || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(post.image || post.video || null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const updatePost = async () => {
    setLoading(true);

    try {
      let mediaURL = post.image || post.video || null;

      // If user selects a new file → upload to cloudinary
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await API.post("/upload/file", formData);
        mediaURL = uploadRes.data.url;
      }

      // Update request
      await API.put(`/posts/update/${post._id}`, {
        content,
        image: mediaURL,
        video: mediaURL
      });

      refresh();
      close();
    } catch (err) {
      console.log(err);
      alert("Failed to update post");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Post
          </h2>
          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
            onClick={close}
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 h-32 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 resize-none"
            placeholder="What's on your mind? Share your thoughts..."
          />

          {/* File Upload Buttons */}
          <div className="flex gap-3 mt-4">
            <label className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 cursor-pointer transition-all duration-200 border border-blue-200">
              <AiOutlinePicture size={20} />
              <span>Change Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
            </label>
            
            <label className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 cursor-pointer transition-all duration-200 border border-purple-200">
              <AiOutlineVideoCamera size={20} />
              <span>Change Video</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleFile}
                className="hidden"
              />
            </label>
          </div>

          {/* Preview */}
          {preview && (
            <div className="mt-4 relative">
              <div className="relative group">
                {preview.includes("mp4") || (file && file.type.startsWith("video/")) ? (
                  <video 
                    src={preview} 
                    controls 
                    className="rounded-xl w-full max-h-80 object-cover shadow-lg"
                  />
                ) : (
                  <img 
                    src={preview} 
                    className="rounded-xl w-full max-h-80 object-cover shadow-lg"
                    alt="Post preview" 
                  />
                )}
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <AiOutlineClose size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={close}
              className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Cancel
            </button>
            
            <button
              onClick={updatePost}
              disabled={loading || (!content.trim() && !preview)}
              className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Updating...
                </div>
              ) : (
                "Update Post"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}