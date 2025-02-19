import React, { useState } from "react";

const EditAnnouncementModal = ({ announcement, isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState(announcement.title);
    const [description, setDescription] = useState(announcement.description);
    const [location, setLocation] = useState(announcement.location);

    const handleSubmit = () => {
        onSave({ ...announcement, title, description, location });
        onClose(); 
    };

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96 md:w-1/3 lg:w-1/4">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Edit Announcement</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm"
                        />
                    </div>
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

export default EditAnnouncementModal;
