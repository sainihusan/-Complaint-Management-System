import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
    fetchStaff();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/admin/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/staff", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaff(res.data);
    } catch (error) {
      console.error("Error fetching staff members:", error);
    }
  };

  const assignComplaint = async (complaintId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/admin/assign",
        { complaintId, staffId: selectedStaff },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComplaints();
    } catch (error) {
      console.error("Error assigning complaint:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Title</th>
              <th className="border p-2">Complaint By</th> {/* ✅ New Column */}
              <th className="border p-2">Status</th>
              <th className="border p-2">Assigned To</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint._id} className="border">
                <td className="border p-2">{complaint.title}</td>
                <td className="border p-2">{complaint.user ? complaint.user.name : "Unknown"}</td> {/* ✅ New Column */}
                <td className="border p-2">{complaint.status}</td>
                <td className="border p-2">
                  {complaint.assignedTo ? complaint.assignedTo.name : "Not Assigned"}
                </td>
                <td className="border p-2">
                  {complaint.status === "Pending" && (
                    <div className="flex gap-2">
                      <select
                        className="border p-1"
                        onChange={(e) => setSelectedStaff(e.target.value)}
                      >
                        <option value="">Select Staff</option>
                        {staff.map((member) => (
                          <option key={member._id} value={member._id}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => assignComplaint(complaint._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Assign
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
  );
};

export default AdminDashboard;
