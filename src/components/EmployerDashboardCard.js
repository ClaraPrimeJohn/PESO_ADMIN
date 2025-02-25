import React, { useState, useEffect } from "react";
import { FaUserCircle, FaCheckCircle, FaPaperPlane, FaBriefcase } from "react-icons/fa";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// Dashboard Card Component
function DashboardCard({ number, label, icon, className }) {
  return (
    <div
      className={`bg-white p-6 m-1 sm:p-8 lg:p-10 rounded-3xl shadow-md flex items-center justify-between transition-transform transform hover:translate-y-[-5px] hover:shadow-lg cursor-pointer ${className}`}
    >
      <div className="flex flex-col items-start text-left">
        <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{number}</div>
        <div className="text-xs sm:text-sm text-gray-500">{label}</div>
      </div>
      <div className="text-green-400 text-4xl sm:text-5xl ml-4">{icon}</div>
    </div>
  );
}

// Employer Dashboard Component
function EmployerDashboard() {
  const [jobCount, setJobCount] = useState(0);
  const [employerUid, setEmployerUid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployerInfo = async (user) => {
      if (!user) return;
      try {
        const userDocRef = doc(db, "employers", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("Employer data:", userData);
          setEmployerUid(user.uid);
        } else {
          console.error("Employer document not found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching employer info:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Logged-in employer UID:", user.uid);
        fetchEmployerInfo(user);
      } else {
        console.error("No employer is logged in.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchJobCount = async () => {
      if (!employerUid) return;
      try {
        console.log(`Fetching jobs for employer UID: ${employerUid}`);
        const q = query(collection(db, "jobs"), where("employerUid", "==", employerUid));
        const querySnapshot = await getDocs(q);
        console.log("Jobs found:", querySnapshot.size);
        setJobCount(querySnapshot.size);
      } catch (error) {
        console.error("Error fetching job count:", error);
      }
    };

    fetchJobCount();
  }, [employerUid]);

  if (loading) {
    return <div className="p-6 sm:p-8 lg:p-14">Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 sm:mb-12 flex justify-start">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
        <DashboardCard number={jobCount} label="Posted Jobs" icon={<FaUserCircle />} />
        <DashboardCard number="03" label="Shortlisted" icon={<FaCheckCircle />} />
        <DashboardCard number="1.7k" label="Applications" icon={<FaPaperPlane />} />
        <DashboardCard number="04" label="Saved Candidates" icon={<FaBriefcase />} />
      </div>
    </div>
  );
}

export default EmployerDashboard;
