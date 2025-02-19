import React, { useState, useEffect } from "react";

const JobDashboard = () => {
  const [selectedJob, setSelectedJob] = useState("Web & Mobile Prototype");
  const [jobData, setJobData] = useState([
    { day: "Sun", views: 50 },
    { day: "Mon", views: 100 },
    { day: "Tue", views: 500 },
    { day: "Wed", views: 300 },
    { day: "Thu", views: 200 },
    { day: "Fri", views: 100 },
    { day: "Sat", views: 50 },
  ]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    if (selectedJob === "Document Writer") {
      setJobData([
        { day: "Sun", views: 30 },
        { day: "Mon", views: 50 },
        { day: "Tue", views: 200 },
        { day: "Wed", views: 150 },
        { day: "Thu", views: 100 },
        { day: "Fri", views: 70 },
        { day: "Sat", views: 20 },
      ]);
    } else if (selectedJob === "Outbound Call Service") {
      setJobData([
        { day: "Sun", views: 70 },
        { day: "Mon", views: 90 },
        { day: "Tue", views: 400 },
        { day: "Wed", views: 250 },
        { day: "Thu", views: 300 },
        { day: "Fri", views: 200 },
        { day: "Sat", views: 100 },
      ]);
    } else {
      setJobData([
        { day: "Sun", views: 50 },
        { day: "Mon", views: 100 },
        { day: "Tue", views: 500 },
        { day: "Wed", views: 300 },
        { day: "Thu", views: 200 },
        { day: "Fri", views: 100 },
        { day: "Sat", views: 50 },
      ]);
    }
  }, [selectedJob]);

  const jobs = [
    { id: 1, title: "Web & Mobile Prototype", type: "Fulltime", location: "Spain", icon: "📺" },
    { id: 2, title: "Document Writer", type: "Part-time", location: "Italy", icon: "📄" },
    { id: 3, title: "Outbound Call Service", type: "Fulltime", location: "USA", icon: "📞" },
    { id: 4, title: "Product Designer", type: "Part-time", location: "Dubai", icon: "🎨" },
    { id: 5, title: "Marketing Specialist", type: "Part-time", location: "UK", icon: "📈" },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-12 p-4 sm:p-6 lg:px-9 ">
      {/* Job Views Component */}
      <div className="bg-white shadow-lg rounded-3xl p-6 w-full lg:w-1/2">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Job Views</h2>
        <div className="mb-4">
          <label className="text-gray-600 text-sm mb-2 block">Jobs:</label>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-green-300">
            <option>Web & Mobile Prototype</option>
            <option>Document Writer</option>
            <option>Outbound Call Service</option>
            <option>Product Designer</option>
            <option>Marketing Specialist</option>
          </select>
        </div>
        <div className="relative bg-green-50 rounded-lg p-4">
          <svg className="w-full h-56" viewBox="0 0 200 100" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#38A169"
              strokeWidth="3"
              points={jobData
                .map((data, idx) => `${idx * (200 / (jobData.length - 1))},${100 - (data.views / 500) * 100}`)
                .join(" ")}
            />
            {jobData.map((data, idx) => (
              <circle
                key={idx}
                cx={idx * (200 / (jobData.length - 1))}
                cy={100 - (data.views / 500) * 100}
                r="4"
                fill="#38A169"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </svg>
          {hoveredIndex !== null && (
            <div
              className="absolute bg-gray-700 text-white text-xs rounded px-2 py-1"
              style={{
                top: `${100 - (jobData[hoveredIndex].views / 500) * 100 - 10}px`,
                left: `${hoveredIndex * (200 / (jobData.length - 1))}px`,
                transform: "translate(-50%, -100%)",
              }}
            >
              {jobData[hoveredIndex].views} views
            </div>
          )}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            {jobData.map((data) => (
              <span key={data.day}>{data.day}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Posted Jobs Component */}
      <div className="bg-white rounded-3xl p-6 w-full lg:w-1/2 shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Posted Job</h2>
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="flex items-center justify-between p-3 bg-white shadow-md rounded-md hover:bg-gray-50 transition"
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{job.icon}</div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">{job.title}</h3>
                  <p className="text-xs text-gray-500">
                    {job.type} · {job.location}
                  </p>
                </div>
              </div>
              <div className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 3a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                </svg>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default JobDashboard;
