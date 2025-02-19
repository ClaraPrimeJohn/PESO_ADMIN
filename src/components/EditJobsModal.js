import React, { useState, useEffect } from "react";

const EditJobsModal = ({ job, isOpen, onClose, onSave }) => {


    const [company, setCompany] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [jobCategory, setJobCategory] = useState("");
    const [location, setLocation] = useState("");
    const [salaryMin, setSalaryMin] = useState("");
    const [salaryMax, setSalaryMax] = useState("");
    const [jobType, setJobType] = useState("");
    const [experience, setExperience] = useState("");

    useEffect(() => {
        if (job) {
            setCompany(job.company || "");
            setJobTitle(job.title || "");
            setJobDescription(job.jobDescription || "");
            setJobCategory(job.jobCategory || "");
            setLocation(job.location || "");
            setSalaryMin(job.salaryMin || "");
            setSalaryMax(job.salaryMax || "");
            setJobType(job.jobType || "");
            setExperience(job.status || "");
        }
    }, [job]);

    const handleSubmit = () => {
        const updatedJob = {
            id: job.id,
            company: company || "",  
            job_title: jobTitle || "",  
            job_description: jobDescription || "",  
            job_category: jobCategory || "",  
            location: location || "",  
            salary_min: salaryMin || "",  
            salary_max: salaryMax || "",  
            job_type: jobType || "",  
            experience: experience || "",  
        };

        onSave(updatedJob);  
    };

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96 md:w-1/3 lg:w-2/5 w">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Edit Job Details</h2>
                    {/* Company */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Company</label>
                        <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
                        />
                    </div>

                    {/* Job Title */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Job Title</label>
                        <input
                            type="text"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
                        />
                    </div>

                    {/* Job Description */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Job Description</label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
                        />
                    </div>

                    {/* Job Category */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Job Category</label>
                        <input
                            type="text"
                            value={jobCategory}
                            onChange={(e) => setJobCategory(e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
                        />
                    </div>

                    {/* Location */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
                        />
                    </div>

                    {/* Salary Range */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Salary Range</label>
                        <div className="flex space-x-4">
                            <input
                                type="number"
                                value={salaryMin}
                                onChange={(e) => setSalaryMin(e.target.value)}
                                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
                                placeholder="Min Salary"
                            />
                            <input
                                type="number"
                                value={salaryMax}
                                onChange={(e) => setSalaryMax(e.target.value)}
                                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
                                placeholder="Max Salary"
                            />
                        </div>
                    </div>

                    {/* Job Type */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-600 mb-2" htmlFor="job-type">
                            Job Type
                        </label>
                        <select
                            id="job-type"
                            value={jobType}
                            onChange={(e) => setJobType(e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                        </select>
                    </div>

                    {/* Experience Level */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-600 mb-2" htmlFor="experience">
                            Experience<span className="text-red-500">*</span>
                        </label>
                        <select
                            id="experience"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md w-full sm:w-auto"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md w-full sm:w-auto"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default EditJobsModal;
