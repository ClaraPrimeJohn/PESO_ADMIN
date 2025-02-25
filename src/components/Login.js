import React, { useState } from "react";
import { db, auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

function AdminEmployerLogin({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            localStorage.removeItem("admin");
            localStorage.removeItem("employer");

            // First check if it's an admin
            const adminRef = collection(db, "admin");
            const q = query(adminRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const adminData = querySnapshot.docs[0].data();
                if (adminData.password === password) {
                    const adminInfo = { role: "admin", email };
                    localStorage.setItem("admin", JSON.stringify(adminInfo));
                    toast.success("Admin logged in!", {
                        duration: 2000,
                    });
                    onLogin();
                    navigate("/admin/dashboard");
                    return;
                } else {
                    toast.error("Invalid admin credentials.", {
                        duration: 2000,
                    });
                    setLoading(false);
                    return;
                }
            }

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                toast.error("Please verify your email.", {
                    duration: 2000,
                });
                setLoading(false);
                return;
            }

            const employerRef = doc(db, "employers", user.uid);
            const employerSnap = await getDoc(employerRef);

            if (employerSnap.exists()) {
                const employerData = employerSnap.data();

                if (!employerData.verified) {
                    await updateDoc(employerRef, { verified: true });
                }

                const employerInfo = {
                    role: "employer",
                    uid: user.uid,
                    email: user.email,
                    companyName: employerData.companyName,
                    companyAddress: employerData.company_address,
                    companyDescription: employerData.company_description,
                    companyPhone: employerData.company_phone,
                    contactPersonName: employerData.contact_person_name,
                    contactPersonEmail: employerData.contact_person_email,
                    linkedinProfile: employerData.linkedin_profile,
                    businessPermit: employerData.business_permit,
                    companyLogo: employerData.company_logo,
                    verified: employerData.verified
                };

                localStorage.setItem("employer", JSON.stringify(employerInfo));
                toast.success("Employer logged in!", {
                    duration: 2000,
                });
                onLogin();
                navigate("/employer/dashboard");
            } else {
                toast.error("Employer not found.", {
                    duration: 2000,
                });

            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Login failed. Check credentials.", {
                duration: 2000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen">
            <div className="w-full md:w-1/2 bg-green-50 flex flex-col justify-center items-center p-24">
                <h1 className="text-4xl font-extrabold mb-6 text-center">Ready to create more opportunities?</h1>
                <p className="text-base text-center">Manage job postings, connect with candidates, and shape the future of work.</p>
            </div>
            <div className="w-full md:w-1/2 flex justify-center items-center bg-white">
                <div className="w-full max-w-md p-6 shadow-lg rounded-lg bg-white">
                    <h2 className="text-2xl font-bold text-center mb-6">Admin Log In</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-400"
                                required
                            />
                        </div>

                        <div className="mb-4 text-left">
                            <Link to="/employer/forgot-password" className="text-sm text-blue-500 hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition flex justify-center items-center"
                            disabled={loading}
                        >
                            {loading ? <ClipLoader size={20} color="#ffffff" /> : "Login"}
                        </button>
                    </form>
                    <p className="text-center mt-4">
                        Need an account?{" "}
                        <Link to="/employer-signup" className="text-blue-500 hover:underline">
                            Sign up as an employer
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AdminEmployerLogin;
