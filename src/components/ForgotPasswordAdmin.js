import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { auth } from "../firebase"; 
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset link sent! Check your email.", { position: "top-center", autoClose: 3000 });
            setEmail(""); 
        } catch (error) {
            toast.error("Error: " + error.message, { position: "top-center", autoClose: 3000 });
        }

        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md sm:w-2/3 md:w-1/2 lg:w-1/3">
                <Link to="/login" className="flex items-center text-gray-600 hover:text-blue-600 mb-4">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back to Login
                </Link>

                <div className="flex flex-col items-center">
                    <div className="bg-blue bg-opacity-10 p-3 rounded-full">
                        <FaLock className="text-darkblue text-2xl" />
                    </div>
                    <h2 className="text-2xl font-semibold mt-4">Forgot Password?</h2>
                    <p className="text-gray-600 text-center mt-2">No worries! Enter your email and we'll send you reset instructions.</p>
                </div>

                <form onSubmit={handleResetPassword} className="mt-6">
                    <label className="block text-gray-700 font-medium">Email Address</label>
                    <div className="relative mt-2">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <FaEnvelope />
                        </span>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-4 bg-blue-500 text-white p-3 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-all disabled:bg-gray-400"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : <><FaEnvelope className="mr-2" /> Send Reset Link</>}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
