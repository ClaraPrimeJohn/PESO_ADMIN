import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const JobApplicants = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { jobId } = useParams();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const q = query(
                    collection(db, 'applications'),
                    where('job_id', '==', jobId)
                );
                const querySnapshot = await getDocs(q);
                const fetchedApplications = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        applicantName: data.applicant_name,
                        applicantEmail: data.applicant_email,
                        applicantContact: data.applicant_contact,
                        applicantAddress: data.applicant_address,
                        company: data.company,
                        jobTitle: data.job_title,
                        resumeLink: data.resume_link,
                        timestamp: data.timestamp?.toDate(),
                    };
                });

                const sortedApplications = fetchedApplications.sort((a, b) =>
                    b.timestamp - a.timestamp
                );

                setApplications(sortedApplications);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching applications:', error);
                setLoading(false);
            }
        };

        if (jobId) {
            fetchApplications();
        }
    }, [jobId]);

    const handleExportPDF = () => {
        const doc = new jsPDF();

        const pageWidth = doc.internal.pageSize.getWidth();
        const marginX = 10;

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Job Applicants Report', pageWidth / 2, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, { align: 'center' });

        const headers = [['Name', 'Email', 'Contact', 'Address', 'Application Date']];
        const tableData = applications.map(app => [
            app.applicantName,
            app.applicantEmail,
            app.applicantContact,
            app.applicantAddress,
            app.timestamp ? format(app.timestamp, 'MMM dd, yyyy') : 'N/A',
            // app.resumeLink || 'N/A'
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


    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-10">
            <div className="max-w-8xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Job Applicants</h1>
                    <div className="space-x-4">
                        <button
                            onClick={handleExportPDF}
                            className="bg-green-500 text-white hover:bg-green-700 py-2 px-4 rounded-full text-sm font-semibold"
                        >
                            Export PDF
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-blue-500 text-white hover:bg-blue-700 py-2 px-4 rounded-full text-sm font-semibold"
                        >
                            Back to Jobs
                        </button>
                    </div>
                </div>

                {applications.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-lg">No applications found for this job.</p>
                    </div>
                ) : (
                    <div className="bg-white shadow-md rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-300">
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-black">Applicant Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-black">Email</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-black">Contact</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-black">Address</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-black">Application Date</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-black">Resume</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map((application) => (
                                        <tr key={application.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-700">{application.applicantName}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                <a
                                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${application.applicantEmail}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    {application.applicantEmail}
                                                </a>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{application.applicantContact}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{application.applicantAddress}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {application.timestamp ? format(application.timestamp, 'MMM dd, yyyy') : 'N/A'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                <a href={application.resumeLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                                    View Resume
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobApplicants;
