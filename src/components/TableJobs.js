import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineEllipsis, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { collection, getDocs, doc, deleteDoc, updateDoc} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditJobsModal from './EditJobsModal';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [sortOption, setSortOption] = useState('active');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'jobs'));
                const fetchedJobs = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        title: data.job_title,
                        company: data.company,
                        location: data.location,
                        salaryMin: data.salary_min,
                        salaryMax: data.salary_max,
                        jobPosted: data.date_posted?.toDate(),
                        applicants: data.skills?.length || 0,
                        status: data.experience,
                        jobCategory: data.job_category,
                        jobDescription: data.job_description,
                        jobType: data.job_type,
                        logo: data.logo,
                        skills: data.skills,
                    };
                });
                setJobs(fetchedJobs);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };

        fetchJobs();
    }, []);
   

    const handleDeleteClick = (job) => {
        setSelectedJob(job);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteDoc(doc(db, 'jobs', selectedJob.id));

            setJobs(prevJobs => prevJobs.filter(job => job.id !== selectedJob.id));

            setIsDeleteConfirmOpen(false);
            setSelectedJob(null);

            toast.success("Deleted successfully!", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
            });
        } catch (error) {
            toast.error("Failed to delete!", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
            });
        }
    };

    const cancelDelete = () => {
        setIsDeleteConfirmOpen(false);
        setSelectedJob(null);
    };

    const handleActionClick = (job) => {
        setSelectedJob(selectedJob && selectedJob.id === job.id ? null : job);
    };

    const handleUpdate = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedJob(null);
    };

    const handleSaveJob = async (updatedJob) => {
        const updatedData = {
            job_title: updatedJob.job_title || "",
            company: updatedJob.company || "",
            location: updatedJob.location || "",
            salary_min: updatedJob.salary_min || "",
            salary_max: updatedJob.salary_max || "",
            experience: updatedJob.experience || "",
            job_category: updatedJob.job_category || "",
            job_description: updatedJob.job_description || "",
            job_type: updatedJob.job_type || "",
            logo: updatedJob.logo || "",
            skills: updatedJob.skills || [],
        };
    
        try {
            const jobRef = doc(db, 'jobs', updatedJob.id);
            await updateDoc(jobRef, updatedData);
            const querySnapshot = await getDocs(collection(db, 'jobs'));
            const fetchedJobs = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data.job_title,
                    company: data.company,
                    location: data.location,
                    salaryMin: data.salary_min,
                    salaryMax: data.salary_max,
                    jobPosted: data.date_posted?.toDate(),
                    applicants: data.skills?.length || 0,
                    status: data.experience,
                    jobCategory: data.job_category,
                    jobDescription: data.job_description,
                    jobType: data.job_type,
                    logo: data.logo,
                    skills: data.skills,
                };
            });
         
            setJobs(fetchedJobs);
            setIsModalOpen(false);
           
            toast.success("Job updated ", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
            });
        } catch (error) {
            toast.error("Error updating job.", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
            });
        }
    };
    

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDeleteConfirmOpen || isModalOpen) return;
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setSelectedJob(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDeleteConfirmOpen, isModalOpen]);

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-10">
            {/* Header Section */}
            <div className="max-w-8xl mx-auto py-4">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Job Listings</h1>
                    <div className="flex flex-wrap items-center space-x-4">
                        <button className="bg-blue-600 text-white hover:bg-blue-700 py-2 px-4 rounded-full text-sm font-semibold mb-2 sm:mb-0">
                            All
                        </button>
                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-full text-sm font-semibold mb-2 sm:mb-0">
                            New
                        </button>
                        <p className="font-semibold mb-2 sm:mb-0">Sort by:</p>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="border border-gray-300 rounded-full py-2 px-4 text-sm font-semibold text-gray-700 mb-2 sm:mb-0"
                        >
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="expired">Expired</option>
                        </select>
                        <button className="bg-green-600 text-white hover:bg-green-700 py-2 px-4 rounded-full text-sm font-semibold">
                            Export PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Jobs Table */}
            <div className="max-w-8xl mx-auto pt-4">
                <div className="shadow-md sm:rounded-3xl bg-white">
                    <table className="min-w-full border-gray-200 rounded-lg">
                        <thead>
                            <tr className="bg-gray-300">
                                <th className="px-3 py-3 text-left text-sm font-semibold text-black rounded-tl-2xl">Title</th>
                                <th className="px-3 py-3 text-left text-sm font-semibold text-black">Company</th>
                                <th className="px-3 py-3 text-left text-sm font-semibold text-black">Location</th>
                                <th className="px-3 py-3 text-left text-sm font-semibold text-black">Salary Range</th>
                                <th className="px-3 py-3 text-left text-sm font-semibold text-black">Job Posted</th>
                                <th className="px-3 py-3 text-left text-sm font-semibold text-black">Applicants</th>
                                <th className="px-3 py-3 text-left text-sm font-semibold text-black">Status</th>
                                <th className="px-3 py-3 text-left text-sm font-semibold text-black rounded-tr-xl">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((job) => (
                                <tr key={job.id} className="border-b border-gray-200">
                                    <td className="px-3 py-3 text-sm text-gray-700">{job.title}</td>
                                    <td className="px-3 py-3 text-sm text-gray-700">{job.company}</td>
                                    <td className="px-3 py-3 text-sm text-gray-700">{job.location}</td>
                                    <td className="px-3 py-3 text-sm text-gray-700">{job.salaryMin} - {job.salaryMax}</td>
                                    <td className="px-3 py-3 text-sm text-gray-700">
                                        {job.jobPosted ? job.jobPosted.toLocaleDateString('en-US') : 'N/A'}
                                    </td>
                                    <td className="px-3 py-3 text-sm text-gray-700">{job.applicants}</td>
                                    <td className="px-3 py-3 text-sm">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${job.status === 'Active' ? 'bg-green-100 text-green-600' : job.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 text-3xl text-gray-700 relative">
                                        <button className="text-gray-500 hover:text-blue-700" onClick={() => handleActionClick(job)}>
                                            <AiOutlineEllipsis />
                                        </button>
                                        {selectedJob && selectedJob.id === job.id && (
                                            <div ref={dropdownRef} className="absolute bg-white border shadow-md mt-2 top-10 rounded-md py-2 w-28 right-1 z-10">
                                                <button onClick={() => handleUpdate(job)} className="flex items-center w-full text-sm text-gray-700 hover:bg-gray-100 py-2 px-4">
                                                    <AiOutlineEdit className="mr-2" />
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDeleteClick(job)} className="flex items-center w-full text-sm text-red-600 hover:bg-gray-100 py-2 px-4">
                                                    <AiOutlineDelete className="mr-2" />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isDeleteConfirmOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96 sm:w-80 md:w-96 lg:w-1/5">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Are you sure you want to delete?</h3>
                        <div className="flex justify-center space-x-4">
                            <button onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded-md text-base w-full sm:w-auto">
                                Yes, Delete
                            </button>
                            <button onClick={cancelDelete} className="bg-gray-300 text-black px-4 py-2 rounded-md text-base w-full sm:w-auto">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <EditJobsModal job={selectedJob} isOpen={isModalOpen} onClose={handleModalClose} onSave={handleSaveJob} />
            )}
        </div>
    );
};

export default Jobs;
