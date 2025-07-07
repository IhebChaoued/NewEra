import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { IJob } from "../../../types/job";

export default function UserJobDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [job, setJob] = useState<IJob | null>(null);
  const [message, setMessage] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);

  useEffect(() => {
    if (id) {
      axios
        .get<IJob>(`http://localhost:5000/api/jobs/${id}`)
        .then((res) => {
          setJob(res.data);
        })
        .catch(console.error);
    }
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("jobId", id as string);
    formData.append("message", message);
    if (cvFile) {
      formData.append("cv", cvFile);
    }

    const token = localStorage.getItem("userToken");
    await axios.post(`http://localhost:5000/api/applications`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Application submitted!");
    router.push("/user/jobs");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {job && (
        <>
          <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
          <p className="mb-2">{job.description}</p>
          <p className="mb-4 text-gray-600">{job.location}</p>

          <form onSubmit={handleApply} className="space-y-4">
            <textarea
              placeholder="Cover letter or message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />

            <input
              type="file"
              onChange={(e) => setCvFile(e.target.files?.[0] || null)}
            />

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Apply
            </button>
          </form>
        </>
      )}
    </div>
  );
}
