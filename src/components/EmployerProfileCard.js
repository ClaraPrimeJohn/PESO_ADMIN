import React, { useEffect, useState } from "react";
import { CiCamera, CiFileOn, CiCloudOn } from "react-icons/ci";
import LogoUser from '../assets/user.png';
import { toast } from "react-hot-toast";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployerProfileCard = () => {
    const navigate = useNavigate();
    const [employer, setEmployer] = useState({
        companyName: "",
        email: "",
        companyPhone: "",
        companyAddress: "",
        contactPersonName: "",
        contactPersonEmail: "",
        linkedinProfile: "",
        companyDescription: "",
        businessPermit: "",
        companyLogo: "",
        uid: "",
    });

    const [originalEmployer, setOriginalEmployer] = useState({});
    const [isLogoLoaded, setIsLogoLoaded] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState({ companyLogo: null, businessPermit: null });
    const [previewUrls, setPreviewUrls] = useState({ companyLogo: "", businessPermit: "" });

    useEffect(() => {
        const fetchEmployerData = async () => {
            const storedEmployer = localStorage.getItem("employer");
            if (!storedEmployer) {
                navigate("/");
                return;
            }

            const parsedEmployer = JSON.parse(storedEmployer);

            try {
                const employerRef = doc(db, "employers", parsedEmployer.uid);
                const employerSnap = await getDoc(employerRef);

                if (employerSnap.exists()) {
                    const firestoreData = employerSnap.data();

                    // Combine Firestore data with proper field mapping
                    const combinedData = {
                        uid: parsedEmployer.uid,
                        email: firestoreData.email || "",
                        companyName: firestoreData.companyName || "",
                        companyAddress: firestoreData.company_address || "",
                        companyDescription: firestoreData.company_description || "",
                        companyPhone: firestoreData.company_phone || "",
                        contactPersonName: firestoreData.contact_person_name || "",
                        contactPersonEmail: firestoreData.contact_person_email || "",
                        linkedinProfile: firestoreData.linkedin_profile || "",
                        businessPermit: firestoreData.business_permit || "",
                        companyLogo: firestoreData.company_logo || "",
                        verified: firestoreData.verified || false
                    };

                    setEmployer(combinedData);
                    setOriginalEmployer(combinedData);

                    // Update localStorage with fresh data
                    localStorage.setItem("employer", JSON.stringify(combinedData));
                } else {
                    console.error("No employer document found");
                    navigate("/");
                }
            } catch (error) {
                console.error("Error fetching employer data:", error);
            }
        };

        fetchEmployerData();
    }, [navigate]);

    const uploadFileToCloudinary = async (file, folder) => {
        if (typeof file === "string") return file;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "peso-files-img");
        formData.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
        formData.append("folder", folder);

        const uploadURL = file.type === "application/pdf"
            ? process.env.REACT_APP_CLOUDINARY_RAW_URL
            : process.env.REACT_APP_CLOUDINARY_URL;

        try {
            const response = await axios.post(uploadURL, formData);
            return response.data.secure_url;
        } catch (error) {
            console.error("Error uploading file to Cloudinary:", error);
            toast.error("Failed to upload file. Please try again.", {
                duration: 2000,
            });
            return "";
        }
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        const currentFileUrl = employer[field];
        let currentFileName = "";

        if (currentFileUrl) {
            try {
                const urlParts = currentFileUrl.split("/");
                currentFileName = decodeURIComponent(urlParts[urlParts.length - 1].split("?")[0]);

                if (file.name === currentFileName) {
                    toast("This file is already uploaded.", {
                        duration: 2000,
                        icon: "⚠️",
                    });

                    e.target.value = null;
                    return;
                }
            } catch (error) {
                console.error("Error extracting filename from URL:", error);
            }
        }

        // Store file in state instead of uploading
        setSelectedFiles((prev) => ({ ...prev, [field]: file }));
        setIsChanged(true);

        // Generate preview URL for images
        if (file.type.startsWith("image/")) {
            setPreviewUrls((prev) => ({
                ...prev,
                [field]: URL.createObjectURL(file),
            }));
        } else {
            setPreviewUrls((prev) => ({
                ...prev,
                [field]: file.name,
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newEmployer = { ...employer, [name]: value };
        setEmployer(newEmployer);
        checkChanges(newEmployer);
    };

    const checkChanges = (updatedEmployer) => {
        setIsChanged(JSON.stringify(updatedEmployer) !== JSON.stringify(originalEmployer));
    };

    const handleSaveProfile = async () => {
        const saveProfilePromise = new Promise(async (resolve, reject) => {
            try {
                if (selectedFiles.companyLogo) {
                    employer.companyLogo = await uploadFileToCloudinary(selectedFiles.companyLogo, "company-logo");
                }
                if (selectedFiles.businessPermit) {
                    employer.businessPermit = await uploadFileToCloudinary(selectedFiles.businessPermit, "permits");
                }

                const formattedEmployer = {
                    uid: employer.uid,
                    email: employer.email,
                    companyName: employer.companyName,
                    company_address: employer.companyAddress,
                    company_description: employer.companyDescription,
                    company_phone: employer.companyPhone,
                    contact_person_name: employer.contactPersonName,
                    contact_person_email: employer.contactPersonEmail,
                    linkedin_profile: employer.linkedinProfile,
                    business_permit: employer.businessPermit,
                    company_logo: employer.companyLogo,
                };

                const employerRef = doc(db, "employers", employer.uid);
                await setDoc(employerRef, formattedEmployer, { merge: true });

                setOriginalEmployer(employer);
                localStorage.setItem("employer", JSON.stringify(employer));
                setIsChanged(false);

                resolve("Profile saved successfully!");
            } catch (error) {
                console.error("Error saving profile:", error);
                reject("Failed to save profile. Please try again.");
            }
        });

        toast.promise(saveProfilePromise, {
            loading: "Saving profile...",
            success: "Profile saved successfully!",
            error: "Failed to save profile. Please try again.",
        });
    };


    return (
        <div className="px-2 py-12 sm:px-4 md:px-6 lg:px-8 w-full mx-auto space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Profile</h1>
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
                {/* Profile Image Card */}
                <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-3xl shadow-lg border border-gray-200 flex flex-col items-center w-full max-w-xs">
                    <div className="relative w-24 sm:w-32 h-24 sm:h-32 mb-4">
                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-300 flex items-center justify-center bg-gray-100">
                            <img
                                src={previewUrls.companyLogo || employer.companyLogo || LogoUser}
                                alt="Company Logo"
                                className="w-full h-full object-cover"
                                onLoad={() => setIsLogoLoaded(true)}
                                onError={() => setIsLogoLoaded(false)}
                                style={{ display: isLogoLoaded ? 'block' : 'none' }}
                            />
                            {!isLogoLoaded && (
                                <span className="absolute text-center text-gray-600">Company Logo</span>
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-gray-200 p-2 rounded-full cursor-pointer shadow-md hover:bg-gray-300 transition-colors">
                            <CiCamera className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, "companyLogo", "company-logo")}
                            />
                        </label>
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mt-2 text-center">{employer.companyName || "Company Name"}</h2>
                </div>

                {/* Main Info Card */}
                <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-3xl shadow-lg border border-gray-200 w-full">
                    <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div>
                            <label className="block text-gray-600 mb-2 text-sm">Company Name</label>
                            <input type="text" name="companyName" readOnly value={employer.companyName} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 cursor-default text-sm" />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-2 text-sm">Company Email</label>
                            <input type="email" name="email" readOnly value={employer.email} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 cursor-default text-sm" />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-2 text-sm">Company Phone</label>
                            <input type="text" name="companyPhone" value={employer.companyPhone} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-sm" />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-2 text-sm">LinkedIn Profile</label>
                            <input type="text" name="linkedinProfile" value={employer.linkedinProfile} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-sm" />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-2 text-sm">Contact Person Name</label>
                            <input type="text" name="contactPersonName" value={employer.contactPersonName} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-sm" />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-2 text-sm">Contact Person Email</label>
                            <input type="email" name="contactPersonEmail" value={employer.contactPersonEmail} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-sm" />
                        </div>
                    </form>
                </div>
            </div>

            {/* Address & Description Card */}
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-3xl shadow-lg border border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Company Address & Description</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                        <label className="block text-gray-600 mb-2 text-sm">Company Address</label>
                        <textarea
                            name="companyAddress"
                            value={employer.companyAddress}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-sm"
                            rows="3"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-2 text-sm">Company Description</label>
                        <textarea
                            name="companyDescription"
                            value={employer.companyDescription}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-sm"
                            rows="3"
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* Business Permit Card */}
            <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-3xl shadow-lg border border-gray-200">
                <div>
                    <label className="block text-gray-600 mb-2 text-sm">Business Permit</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {previewUrls.businessPermit ? (
                            previewUrls.businessPermit.endsWith(".pdf") ? (
                                <p className="text-blue-500 text-sm">{previewUrls.businessPermit}</p>
                            ) : (
                                <img src={previewUrls.businessPermit} alt="Business Permit Preview" className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg" />
                            )
                        ) : employer.businessPermit ? (
                            <a
                                href={employer.businessPermit}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-500 border border-blue-500 rounded-xl p-1 hover:text-blue-600 underline gap-1 transition text-sm"
                            >
                                <CiFileOn className="text-lg" /> {decodeURIComponent(employer.businessPermit.split('/').pop())}
                            </a>
                        ) : (
                            <span className="text-gray-500 text-sm">No permit uploaded</span>
                        )}

                        <label className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer border border-gray-300 rounded-xl p-1 transition text-sm">
                            <CiCloudOn className="text-md" />
                            <span>{employer.businessPermit || previewUrls.businessPermit ? "Change File" : "Upload Permit"}</span>
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => handleFileChange(e, "businessPermit", "permits")}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={!isChanged}
                    className={`w-full text-white font-medium py-2 sm:py-3 rounded-xl mt-6 text-sm sm:text-base
            ${!isChanged ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} 
            transition-colors duration-200`}
                >
                    Save Profile
                </button>
            </div>
        </div>

    );
};

export default EmployerProfileCard;
