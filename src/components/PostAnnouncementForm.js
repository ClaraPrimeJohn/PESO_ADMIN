import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

function PostAnnouncementForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedDescription = description.trim();

    if (!title.trim() || !trimmedDescription || !location.trim()) {
      toast.error("All fields are required!", {
        duration: 2000,
      });
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "announcements"), {
        title: title.trim(),
        description: trimmedDescription,
        location: location.trim(),
        date: serverTimestamp(),
      });

      toast.success("Posted successfully!", {
        duration: 2000,
      });

      setTitle("");
      setDescription("");
      setLocation("");
    } catch (error) {
      console.error("Error posting", error);
      toast.error("Failed to post.", {
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-10">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Post a New Announcement</h1>
      <div className="mx-auto bg-white p-8 rounded-3xl shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="p-3">
            <h2 className="text-xl font-medium text-gray-800 mb-4">Announcement Details</h2>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2" htmlFor="announcement-title">
                Title<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="announcement-title"
                placeholder="Ex: Sales Manager"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-3xl px-3 py-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 mb-2" htmlFor="announcement-description">
                Description<span className="text-red-500">*</span>
              </label>
              <textarea
                id="announcement-description"
                placeholder="We are searching for an experienced Sales Manager to drive revenue growth."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-3xl px-3 py-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="4"
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 mb-2" htmlFor="location">
                Location<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                placeholder="Ex: Pasay City, Metro Manila"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-gray-300 rounded-3xl px-3 py-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="px-3">
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? "bg-blue-700 text-white" : "bg-green-500 hover:bg-green-600"} text-white font-medium py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center`}
            >
              {loading ? <ClipLoader color="#ffffff" size={20} /> : "Post Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostAnnouncementForm;
