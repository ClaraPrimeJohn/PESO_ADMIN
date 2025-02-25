import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-hot-toast";

function EmployerSignup() {
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const checkIfEmployerExists = async (companyName, email) => {
        const q = query(
            collection(db, "employers"),
            where("companyName", "==", companyName),
        );
        const q2 = query(
            collection(db, "employers"),
            where("email", "==", email),
        );

        const nameSnapshot = await getDocs(q);
        const emailSnapshot = await getDocs(q2);

        if (!nameSnapshot.empty) {
            return { exists: true, field: "Company Name" };
        }
        if (!emailSnapshot.empty) {
            return { exists: true, field: "Email Address" };
        }
        return { exists: false };
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        const signupPromise = new Promise(async (resolve, reject) => {
            try {
                const existingEmployer = await checkIfEmployerExists(companyName, email);
                if (existingEmployer.exists) {
                    reject(`${existingEmployer.field} is already in use.`);
                    return;
                }

                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await sendEmailVerification(user);

                await setDoc(doc(db, "employers", user.uid), {
                    companyName,
                    email,
                    uid: user.uid,
                    verified: false,
                });

                resolve("Account created! Check your email to verify.");
                navigate("/");
            } catch (error) {
                console.error("Error signing up:", error);
                reject(error.message);
            } finally {
                setLoading(false);
            }
        });

        toast.promise(signupPromise, {
            loading: "Creating account...",
            success: "Account created! Check your email to verify.", 
            error: (err) => err, 
        });
    };


    return (
        <div className="flex justify-center items-center min-h-screen bg-green-50">
            <div className="w-full max-w-md p-6 shadow-lg rounded-lg bg-white">
                <h2 className="text-2xl font-bold text-center mb-6">Employer Sign Up</h2>
                <form onSubmit={handleSignup}>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Company Name</label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition duration-300 flex justify-center items-center"
                        disabled={loading}
                    >
                        {loading ? <ClipLoader size={20} color="#ffffff" /> : "Sign Up"}
                    </button>
                </form>
                <p className="text-center text-black mt-4">
                    Already have an account? <Link to="/" className="text-blue-500 hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
}

export default EmployerSignup;
