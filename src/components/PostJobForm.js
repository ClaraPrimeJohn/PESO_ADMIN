import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import axios from "axios";
import { toast } from "react-hot-toast";
import { CiInboxOut } from "react-icons/ci";
import { ClipLoader } from "react-spinners";

function PostJobForm() {

  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [location, setLocation] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("Beginner");
  const [logo, setLogo] = useState(null);
  const [recentLogos, setRecentLogos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRecentLogos();
  }, []);

  const fetchRecentLogos = async () => {
    try {
      const q = query(collection(db, "jobs"), orderBy("date_posted", "desc"), limit(5));
      const querySnapshot = await getDocs(q);
      const logos = new Set();
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.logo) logos.add(data.logo);
      });
      setRecentLogos([...logos]);
    } catch (error) {
      console.error("Error fetching recent logos:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!company || !jobTitle || !jobDescription || !location || !logo) {
      toast.error("All fields are required, including a logo!", {
        duration: 2000,
      });
      return;
    }

    setLoading(true);

    try {
      let logoUrl = logo;
      if (typeof logo !== "string") {
        const formData = new FormData();
        formData.append("file", logo);
        formData.append("upload_preset", "peso-files-img");
        formData.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
        formData.append("folder", "company-logo");

        const cloudinaryResponse = await axios.post(
          process.env.REACT_APP_CLOUDINARY_URL,
          formData
        );

        logoUrl = cloudinaryResponse.data.secure_url;
      }


      await addDoc(collection(db, "jobs"), {
        company,
        job_title: jobTitle,
        job_description: jobDescription,
        job_category: jobCategory,
        job_type: jobType,
        location,
        salary_min: Number(salaryMin),
        salary_max: Number(salaryMax),
        skills,
        experience,
        logo: logoUrl,
        date_posted: serverTimestamp(),
      });

      toast.success("Job posted!", {
        duration: 2000,
      });

      setCompany("");
      setJobTitle("");
      setJobDescription("");
      setJobCategory("");
      setJobType("");
      setLocation("");
      setSalaryMin("");
      setSalaryMax("");
      setSkills("");
      setExperience("Beginner");
      setLogo(null);

      fetchRecentLogos();
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error("Failed to post the job.", {
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-10">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Post a New Job</h1>
      <div className="mx-auto bg-white p-8 rounded-3xl shadow-md">
        <form onSubmit={handleSubmit}>
          {/* Job Details */}
          <div className="p-3">
            <h2 className="text-xl font-medium text-gray-800 mb-4">Job Details</h2>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2" htmlFor="company">
                Company<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Ex: Acme Corp"
                className="w-full border border-gray-300 rounded-3xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 mb-2" htmlFor="job-title">
                Job Title<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="job-title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Ex: Product Designer"
                className="w-full border border-gray-300 rounded-3xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 mb-2" htmlFor="job-description">
                Job Description<span className="text-red-500">*</span>
              </label>
              <textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Write about the job in detail..."
                className="w-full border border-gray-300 rounded-3xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="4"
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 mb-2" htmlFor="job-category">
                Job Category
              </label>
              <input
                type="text"
                id="job-category"
                value={jobCategory}
                onChange={(e) => setJobCategory(e.target.value)}
                placeholder="Ex: Software Development"
                className="w-full border border-gray-300 rounded-3xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 mb-2" htmlFor="job-type">
                Job Type
              </label>
              <select
                id="job-type"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full border border-gray-300 rounded-3xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 mb-2" htmlFor="location">
                Location<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: New York, NY"
                className="w-full border border-gray-300 rounded-3xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 mb-2" htmlFor="salary-min">
                Minimum Salary
              </label>
              <input
                type="number"
                id="salary-min"
                value={salaryMin}
                onChange={(e) => setSalaryMin(Number(e.target.value))}
                placeholder="Ex: 50000"
                className="w-full border border-gray-300 rounded-3xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 mb-2" htmlFor="salary-max">
                Maximum Salary
              </label>
              <input
                type="number"
                id="salary-max"
                value={salaryMax}
                onChange={(e) => setSalaryMax(Number(e.target.value))}
                placeholder="Ex: 100000"
                className="w-full border border-gray-300 rounded-3xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Company Logo <span className="text-red-500">*</span></label>
              <div className="flex gap-4 items-center">
                {logo ? (
                  <div className="w-20 h-20 border rounded-full overflow-hidden">
                    <img
                      src={typeof logo === "string" ? logo : URL.createObjectURL(logo)}
                      alt="Selected logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 border rounded-full text-sm text-center flex items-center justify-center text-gray-500">
                    No logo selected
                  </div>
                )}
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  onClick={() => setShowModal(true)}
                >
                  Choose Logo
                </button>
                {logo && (
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    onClick={() => setLogo(null)}
                  >
                    Clear Selection
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Skills & Experience */}
          <div className="p-3">
            <h2 className="text-xl font-medium text-gray-800 mb-4">Skills & Experience</h2>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2" htmlFor="skills">
                Skills<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Add Skills"
                className="w-full border border-gray-300 rounded-3xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 mb-2" htmlFor="experience">
                Experience<span className="text-red-500">*</span>
              </label>
              <select
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full border border-gray-300 rounded-3xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>

            </div>
          </div>



          {/* Submit Button */}
          <div className="px-3">
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? "bg-blue-700 text-white" : "bg-green-500 hover:bg-green-600"} text-white font-medium py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
            >
              {loading ? (
                <ClipLoader color="white" size={24} />
              ) : (
                "Post Job"
              )}
            </button>
          </div>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50 transition-opacity duration-300">
          <div className="bg-white w-[36rem] rounded-2xl p-8 shadow-lg relative">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Select a Logo</h2>

            {/* Recently Uploaded Logos Section */}
            <div className="mb-24">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Recently Uploaded Logos</h3>
              {recentLogos.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto py-2">
                  {recentLogos.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Recent logo ${index + 1}`}
                      className="w-20 h-20 object-cover cursor-pointer border border-gray-300 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-transform"
                      onClick={() => {
                        setLogo(url);
                        setShowModal(false);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No recently uploaded logos found.</p>
              )}
            </div>

            {/* Upload from Device Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Upload from Device</h3>
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full border border-dashed border-gray-300 rounded-md cursor-pointer hover:border-green-500 hover:bg-green-50 p-4 transition-all"
              >
                <CiInboxOut className="w-10 h-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click to upload a logo</span>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    setLogo(e.target.files[0]);
                    setShowModal(false);
                  }}
                />
              </label>
            </div>

            {/* Cancel Button */}
            <button
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostJobForm;
