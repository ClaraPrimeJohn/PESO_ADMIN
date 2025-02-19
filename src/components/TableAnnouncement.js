import React, { useState, useEffect, useRef } from "react";
import { AiOutlineEllipsis } from "react-icons/ai";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditAnnouncementModal from "./EditAnnouncementModal";

const TableAnnouncements = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [announcements, setAnnouncements] = useState([]);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState(null);
    const dropdownRef = useRef(null);
    const modalRef = useRef(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "announcements"));
                const announcementsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAnnouncements(announcementsData);
            } catch (error) {
                console.error("Error fetching announcements:", error);
            }
        };

        fetchAnnouncements();
    }, []);

    const filteredAnnouncements = announcements.filter((announcement) =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleActionClick = (announcement) => {
        setSelectedAnnouncement(announcement);
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleDelete = (announcement) => {
        setAnnouncementToDelete(announcement);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const docRef = doc(db, "announcements", announcementToDelete.id);
            await deleteDoc(docRef);

            toast.success("Deleted successfully!", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
            });

            setAnnouncements((prevAnnouncements) =>
                prevAnnouncements.filter((announcement) => announcement.id !== announcementToDelete.id)
            );
            
            setIsDeleteConfirmOpen(false);
        } catch (error) {
            toast.error("Failed to delete!", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
            });
            setIsDeleteConfirmOpen(false);
        }
    };

    const cancelDelete = () => {
        setIsDeleteConfirmOpen(false);
        setAnnouncementToDelete(null);
    };

    const handleEdit = () => {
        setIsModalOpen(true);
        setIsDropdownOpen(false);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedAnnouncement(null);
    };

    const handleUpdate = async (updatedAnnouncement) => {
        try {
            const docRef = doc(db, "announcements", updatedAnnouncement.id);
            await updateDoc(docRef, updatedAnnouncement);

            toast.success("Updated successfully!", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
            });

            setAnnouncements((prevAnnouncements) =>
                prevAnnouncements.map((announcement) =>
                    announcement.id === updatedAnnouncement.id ? updatedAnnouncement : announcement
                )
            );
            handleModalClose();
        } catch (error) {
            toast.error("Failed to update", {
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
            if (isDeleteConfirmOpen) return;
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setSelectedAnnouncement(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDeleteConfirmOpen]);


    return (
        <div className="py-10 px-4 sm:px-6 lg:px-10">
            {/* Header Section */}
            <div className="max-w-8xl mx-auto py-4">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Announcements</h1>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 px-4 py-2 rounded-3xl text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Announcements Table */}
            <div className="max-w-8xl mx-auto pt-4">
                <div className="shadow-md sm:rounded-3xl bg-white">
                    <table className="min-w-full border-gray-200 rounded-xl">
                        <thead>
                            <tr className="bg-gray-300">
                                <th className="px-3 py-3 text-left text-sm font-semibold text-black rounded-tl-xl">Title</th>
                                <th className="px-3 py-3 text-left text-sm font-semibold text-black">Description</th>
                                <th className="px-3 py-3 text-left text-sm font-semibold text-black">Location</th>
                                <th className="px-3 py-3 text-left text-sm font-semibold text-black">Time & Date</th>
                                <th className="px-3 py-3 text-left text-sm font-semibold text-black rounded-tr-xl">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAnnouncements.map((announcement) => (
                                <tr key={announcement.id} className="border-b border-gray-200">
                                    <td className="px-3 py-4 text-sm text-gray-700">{announcement.title}</td>
                                    <td className="px-3 py-4 text-sm text-gray-700">{announcement.description}</td>
                                    <td className="px-3 py-4 text-sm text-gray-700">{announcement.location}</td>
                                    <td className="px-3 py-4 text-sm text-gray-700">
                                        {announcement.date && announcement.date.toDate().toLocaleDateString()}
                                    </td>
                                    <td className="px-3 py-4 text-3xl text-gray-700 relative">
                                        <button
                                            className="text-gray-500 hover:text-blue-700 text-center"
                                            onClick={() => handleActionClick(announcement)}>
                                            <AiOutlineEllipsis />
                                        </button>
                                        {isDropdownOpen && selectedAnnouncement && selectedAnnouncement.id === announcement.id && (
                                            <div
                                                ref={dropdownRef}
                                                className="absolute bg-white border shadow-md mt-2 top-10 rounded-md py-2 w-28 right-1 z-10"
                                            >
                                                <button
                                                    onClick={handleEdit}
                                                    className="flex items-center w-full text-sm text-gray-700 hover:bg-gray-100 py-2 px-4"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(announcement)}
                                                    className="flex items-center w-full text-sm text-red-600 hover:bg-gray-100 py-2 px-4"
                                                >
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

            {/* Edit Announcement Modal */}
            {isModalOpen && selectedAnnouncement && (
                <div ref={modalRef}>
                    <EditAnnouncementModal
                        announcement={selectedAnnouncement}
                        isOpen={isModalOpen}
                        onClose={handleModalClose}
                        onSave={handleUpdate}
                    />
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteConfirmOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96 w sm:w-80 md:w-96 lg:w-1/5">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Are you sure you want to delete?</h3>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded-md text-base w-full sm:w-auto"
                                onClick={confirmDelete}
                            >
                                Yes, Delete
                            </button>
                            <button
                                className="bg-gray-300 text-black px-4 py-2 rounded-md text-base w-full sm:w-auto"
                                onClick={cancelDelete}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>

            )}
        </div>
    );
};

export default TableAnnouncements;
