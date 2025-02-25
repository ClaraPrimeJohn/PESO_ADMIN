import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineEllipsis, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { collection, getDocs, doc, deleteDoc, updateDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-hot-toast";
import EditJobsModal from './EditJobsModal';
import { useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Jobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [sortOption, setSortOption] = useState('active');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [applicantCounts, setApplicantCounts] = useState({});

    useEffect(() => {
        const fetchApplicantCounts = async () => {
            if (jobs.length === 0) return;

            try {
                const counts = {};
                const promises = jobs.map(async (job) => {
                    const q = query(
                        collection(db, 'applications'),
                        where('job_id', '==', job.id)
                    );
                    const snapshot = await getDocs(q);
                    counts[job.id] = snapshot.size;
                });

                await Promise.all(promises);
                setApplicantCounts(counts);
            } catch (error) {
                console.error('Error fetching applicant count:', error);
            }
        };

        fetchApplicantCounts();
    }, [jobs])

    useEffect(() => {
        const fetchJobs = async (sortValue) => {
            try {
                let jobsQuery;
                if (sortValue === 'open') {
                    jobsQuery = query(collection(db, 'jobs'), where('isOpen', '==', true));
                } else if (sortValue === 'closed') {
                    jobsQuery = query(collection(db, 'jobs'), where('isOpen', '==', false));
                } else {
                    jobsQuery = collection(db, 'jobs');
                }

                const querySnapshot = await getDocs(jobsQuery);
                const fetchedJobs = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        title: data.job_title,
                        company: data.company,
                        location: data.location,
                        salaryMin: data.salary_min,
                        salaryMax: data.salary_max,
                        jobPosted: data.date_posted ? data.date_posted.toDate() : null,
                        applicants: 0,
                        isOpen: data.isOpen ?? true,
                        jobCategory: data.job_category,
                        jobDescription: data.job_description,
                        jobType: data.job_type,
                        logo: data.logo,
                        skills: data.skills,
                        experience: data.experience,
                    };
                });

                fetchedJobs.sort((a, b) => (b.jobPosted ? b.jobPosted.getTime() : 0) - (a.jobPosted ? a.jobPosted.getTime() : 0));

                setJobs(fetchedJobs);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };

        fetchJobs(sortOption);
    }, [sortOption]);


    const handleDeleteClick = (job) => {
        setSelectedJob(job);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        const deletePromise = new Promise(async (resolve, reject) => {
            try {
                await deleteDoc(doc(db, "jobs", selectedJob.id));

                setJobs(prevJobs => prevJobs.filter(job => job.id !== selectedJob.id));

                setIsDeleteConfirmOpen(false);
                setSelectedJob(null);

                resolve("Deleted successfully!");
            } catch (error) {
                reject("Failed to delete!");
            }
        });

        toast.promise(deletePromise, {
            loading: "Deleting job, please wait...",
            success: "Deleted successfully!",
            error: "Failed to delete!",
        });
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
            // logo: updatedJob.logo || "",
            // skills: updatedJob.skills || [],
        };

        const updatePromise = new Promise(async (resolve, reject) => {
            try {
                const jobRef = doc(db, "jobs", updatedJob.id);
                await updateDoc(jobRef, updatedData);
                const querySnapshot = await getDocs(collection(db, "jobs"));
                const fetchedJobs = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        title: data.job_title,
                        company: data.company,
                        location: data.location,
                        salaryMin: data.salary_min,
                        salaryMax: data.salary_max,
                        jobPosted: data.date_posted ? data.date_posted.toDate() : null,
                        applicants: data.skills?.length || 0,
                        experience: data.experience,
                        jobCategory: data.job_category,
                        jobDescription: data.job_description,
                        jobType: data.job_type,
                        isOpen: data.isOpen ?? true,
                        // logo: data.logo,
                        // skills: data.skills,
                    };
                });

                fetchedJobs.sort((a, b) => (b.jobPosted ? b.jobPosted.getTime() : 0) - (a.jobPosted ? a.jobPosted.getTime() : 0));

                setJobs(fetchedJobs);
                setIsModalOpen(false);
                resolve("Job updated");
            } catch (error) {
                reject("Error updating job.");
            }
        });

        toast.promise(updatePromise, {
            loading: "Updating job, please wait...",
            success: "Job updated",
            error: "Error updating job.",
        });
    };


    const handleToggleJobStatus = async (job) => {
        const togglePromise = new Promise(async (resolve, reject) => {
            try {
                const jobRef = doc(db, "jobs", job.id);
                const newStatus = !job.isOpen; // Determine new status

                await updateDoc(jobRef, { isOpen: newStatus });

                setJobs((prevJobs) =>
                    prevJobs.map((j) =>
                        j.id === job.id ? { ...j, isOpen: newStatus } : j
                    )
                );

                resolve(`Job marked as ${newStatus ? "Open" : "Closed"}`);
            } catch (error) {
                console.error("Error updating job status:", error);
                reject("Failed to update job status");
            }
        });

        toast.promise(togglePromise, {
            loading: "Updating job status, please wait...",
            success: (msg) => msg, // Use the resolved message dynamically
            error: "Failed to update job status.",
        });
    };



    const handleExportPDF = () => {
        const doc = new jsPDF('portrait', 'mm', 'a4');

        const pageWidth = doc.internal.pageSize.getWidth();
        const marginX = 10;

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Jobs Report', pageWidth / 2, 20, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, { align: 'center' });

        const tableData = jobs.map(job => [
            job.title,
            job.company,
            job.location,
            `${job.salaryMin} - ${job.salaryMax}`,
            job.jobPosted ? job.jobPosted.toLocaleDateString('en-US') : 'N/A',
            applicantCounts[job.id] || 0,
            job.isOpen ? 'Open' : 'Closed'
        ]);

        const headers = [['Title', 'Company', 'Location', 'Salary Range', 'Posted Date', 'Applicants', 'Status']];

        doc.autoTable({
            head: headers,
            body: tableData,
            startY: 35,
            tableWidth: 'auto',
            styles: {
                fontSize: 7,
                cellPadding: 3,
                overflow: 'linebreak'
            },
            headStyles: {
                fillColor: [52, 73, 94],
                textColor: 255,
                fontSize: 8,
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
            margin: { left: marginX, right: marginX, top: 35 }
        });

        window.open(doc.output('bloburl'), '_blank');
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
                        <input
                            type="text"
                            placeholder="Search..."
                            className="border border-gray-300 px-4 py-2 rounded-3xl text-sm"
                        />
                        <p className="font-semibold mb-2 sm:mb-0">Sort by:</p>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="border border-gray-300 rounded-full py-2 px-4 text-sm font-semibold text-gray-700 mb-2 sm:mb-0"
                        >
                            <option value="all">All Jobs</option>
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                        </select>
                        <button
                            onClick={handleExportPDF}
                            className="bg-green-600 text-white hover:bg-green-700 py-2 px-4 rounded-full text-sm font-semibold"
                        >
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
                                    <td className="px-3 py-3 text-sm text-gray-700">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => navigate(`/admin/jobs/${job.id}/applicants`)}
                                                className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded-full text-xs font-semibold"
                                            >
                                                {applicantCounts[job.id] || 0} applicants
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3 text-sm">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${job.isOpen
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-red-100 text-red-600'
                                            }`}>
                                            {job.isOpen ? 'Open' : 'Closed'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-3xl text-gray-700 relative">
                                        <button className="text-gray-500 hover:text-blue-700" onClick={() => handleActionClick(job)}>
                                            <AiOutlineEllipsis />
                                        </button>
                                        {selectedJob && selectedJob.id === job.id && (
                                            <div ref={dropdownRef} className="absolute bg-white border shadow-md mt-2 top-10 rounded-md py-2 w-36 right-4 z-10">
                                                <button onClick={() => handleUpdate(job)} className="flex items-center w-full text-sm text-gray-700 hover:bg-gray-100 py-2 px-4">
                                                    <AiOutlineEdit className="mr-2" />
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDeleteClick(job)} className="flex items-center w-full text-sm text-red-600 hover:bg-gray-100 py-2 px-4">
                                                    <AiOutlineDelete className="mr-2" />
                                                    Delete
                                                </button>
                                                <button
                                                    onClick={() => handleToggleJobStatus(job)}
                                                    className="flex items-center w-full text-sm text-blue-600 hover:bg-gray-100 py-2 px-4"
                                                >
                                                    <AiOutlineEdit className="mr-2" />
                                                    <span>Mark {job.isOpen ? 'Closed' : 'Open'}</span>
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
