import React, { useState, useEffect, useRef } from "react";
import { AiOutlineEllipsis } from "react-icons/ai";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-hot-toast";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
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
    const [currentPage, setCurrentPage] = useState(1);
    const [announcementsPerPage] = useState(10);
    const modalRef = useRef(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "announcements"));
                const announcementsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                announcementsData.sort((a, b) => {
                    if (!a.date || !b.date) return 0;
                    return b.date.toDate() - a.date.toDate();
                });

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

    // Pagination logic
    const indexOfLastAnnouncement = currentPage * announcementsPerPage;
    const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
    const currentAnnouncements = filteredAnnouncements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);
    const totalPages = Math.ceil(filteredAnnouncements.length / announcementsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            setSelectedAnnouncement(null);
        }
    };

    const handleActionClick = (announcement) => {
        setSelectedAnnouncement(announcement);
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleDelete = (announcement) => {
        setAnnouncementToDelete(announcement);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        const deletePromise = new Promise(async (resolve, reject) => {
            try {
                const docRef = doc(db, "announcements", announcementToDelete.id);
                await deleteDoc(docRef);

                setAnnouncements((prevAnnouncements) =>
                    prevAnnouncements.filter((announcement) => announcement.id !== announcementToDelete.id)
                );

                setIsDeleteConfirmOpen(false);
                resolve("Deleted successfully!");
            } catch (error) {
                setIsDeleteConfirmOpen(false);
                reject("Failed to delete!");
            }
        });

        toast.promise(deletePromise, {
            loading: "Deleting announcement, please wait...",
            success: "Deleted successfully!",
            error: "Failed to delete!",
        });
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
        const updatePromise = new Promise(async (resolve, reject) => {
            try {
                const docRef = doc(db, "announcements", updatedAnnouncement.id);
                await updateDoc(docRef, updatedAnnouncement);

                setAnnouncements((prevAnnouncements) =>
                    prevAnnouncements.map((announcement) =>
                        announcement.id === updatedAnnouncement.id ? updatedAnnouncement : announcement
                    )
                );

                handleModalClose();
                resolve("Updated successfully!");
            } catch (error) {
                reject("Failed to update");
            }
        });

        toast.promise(updatePromise, {
            loading: "Updating announcement, please wait...",
            success: "Updated successfully!",
            error: "Failed to update",
        });
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const marginX = 10;

        // Title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Announcements Report', pageWidth / 2, 20, { align: 'center' });

        // Date
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, { align: 'center' });

        // Table Headers & Data
        const headers = [['Title', 'Description', 'Location', 'Date']];
        const tableData = announcements.map(ann => [
            ann.title,
            ann.description,
            ann.location,
            ann.date ? ann.date.toDate().toLocaleDateString() : 'N/A'
        ]);

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
                        <button
                            onClick={handleExportPDF}
                            className="bg-green-600 text-white hover:bg-green-700 py-2 px-4 rounded-full text-sm font-semibold"
                        >
                            Export PDF
                        </button>
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
                            {currentAnnouncements.map((announcement) => (
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
                    <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                        <div className="flex-1 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{indexOfFirstAnnouncement + 1}</span> to{" "}
                                    <span className="font-medium">
                                        {Math.min(indexOfLastAnnouncement, filteredAnnouncements.length)}
                                    </span>{" "}
                                    of <span className="font-medium">{filteredAnnouncements.length}</span> results
                                </p>
                            </div>
                            <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-xs font-medium ${
                                        currentPage === 1 
                                        ? 'text-gray-300 cursor-not-allowed' 
                                        : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => paginate(i + 1)}
                                        className={`relative inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-large ${
                                            currentPage === i + 1
                                            ? 'z-10 bg-blue-50 border-blue text-blue'
                                            : 'bg-white text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-xs font-medium ${
                                        currentPage === totalPages 
                                        ? 'text-gray-300 cursor-not-allowed' 
                                        : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                </nav>
                            </div>
                        </div>
                    </div>
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