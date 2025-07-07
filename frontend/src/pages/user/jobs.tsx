import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { IJob } from "../../types/job";

export default function UserJobsPage() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<{ results: IJob[] }>("http://localhost:5000/api/jobs")
      .then((res) => {
        setJobs(res.data.results);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Available Jobs</h1>

      {loading && <p>Loading...</p>}

      <ul className="space-y-4">
        {jobs.map((job) => (
          <li key={job._id} className="p-4 border rounded hover:bg-gray-50">
            <Link
              href={`/user/job/${job._id}`}
              className="text-blue-600 underline"
            >
              {job.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
