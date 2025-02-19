import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineEllipsis, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageAccountsTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchEmployers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'employers'));
                const employersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAccounts(employersData);
            } catch (error) {
                console.error('Error fetching employers:', error);
            }
        };

        fetchEmployers();
    }, []);

    const filteredAccounts = accounts.filter((account) =>
        account.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleActionClick = (account) => {
        setSelectedAccount(selectedAccount && selectedAccount.id === account.id ? null : account);
    };

    const handleUpdate = () => alert('Update functionality goes here');
    
    const handleDeleteClick = (account) => {
        setAccountToDelete(account);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (accountToDelete) {
            try {
                await deleteDoc(doc(db, 'employers', accountToDelete.id));
                setAccounts(accounts.filter(acc => acc.id !== accountToDelete.id));
                setIsDeleteConfirmOpen(false);
                setAccountToDelete(null);
                toast.success('Deleted successfully!', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                });
            } catch (error) {
                console.error('Error deleting:  ', error);
                toast.error('Error deleting.', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                });
            }
        }
    };

    const cancelDelete = () => {
        setIsDeleteConfirmOpen(false);
        setAccountToDelete(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setSelectedAccount(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-10">
            <ToastContainer />
            <div className="max-w-8xl mx-auto py-4">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Employers</h1>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Search by Company or Email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 px-4 py-2 rounded-3xl text-sm"
                        />
                        <button className="bg-green-600 text-white hover:bg-green-700 py-2 px-4 rounded-full text-sm font-semibold">
                            Export PDF
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-8xl mx-auto pt-4">
                <div className="shadow-md sm:rounded-3xl bg-white">
                    <table className="min-w-full border-gray-200 rounded-lg">
                        <thead>
                            <tr className="bg-gray-300">
                                <th className="px-3 py-3 text-left text-sm font-semibold text-black border-t rounded-tl-xl">Company Name</th>
                                <th className="px-3 py-3 text-left text-sm font-semibold text-black border-t">Email</th>
                                <th className="px-3 py-3 text-left text-sm font-semibold text-black border-t">Verified</th>
                                <th className="px-3 py-3 text-left text-sm font-semibold text-black border-t rounded-tr-xl">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAccounts.map((account, index) => (
                                <tr key={account.id || index} className="border-b border-gray-200">
                                    <td className="px-3 py-4 text-sm text-gray-700">{account.companyName}</td>
                                    <td className="px-3 py-4 text-sm text-gray-700">{account.email}</td>
                                    <td className="px-3 py-4 text-sm text-gray-700">
                                        {account.verified ? '✔️ Yes' : '❌ No'}
                                    </td>
                                    <td className="px-3 py-4 text-3xl text-gray-700 relative">
                                        <button
                                            className="text-gray-500 hover:text-blue-700"
                                            onClick={() => handleActionClick(account)}
                                        >
                                            <AiOutlineEllipsis />
                                        </button>
                                        {selectedAccount && selectedAccount.id === account.id && (
                                            <div
                                                ref={dropdownRef}
                                                className="absolute bg-white border shadow-md mt-2 top-5 rounded-md py-2 w-28 right-1 z-10"
                                            >
                                                <button
                                                    onClick={handleUpdate}
                                                    className="flex items-center w-full text-sm text-gray-700 hover:bg-gray-100 py-2 px-4"
                                                >
                                                    <AiOutlineEdit className="mr-2" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(account)}
                                                    className="flex items-center w-full text-sm text-red-600 hover:bg-gray-100 py-2 px-4"
                                                >
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
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                            Are you sure you want to delete?
                        </h3>
                        <div className="flex justify-center space-x-4">
                            <button className="bg-red-600 text-white px-4 py-2 rounded-md text-base w-full sm:w-auto" onClick={confirmDelete}>
                                Yes, Delete
                            </button>
                            <button className="bg-gray-300 text-black px-4 py-2 rounded-md text-base w-full sm:w-auto" onClick={cancelDelete}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAccountsTable;
