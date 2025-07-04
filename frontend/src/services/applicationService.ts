import axios from "axios";
import { IApplication } from "../types/application";

/**
 * Fetch all applications belonging to the company.
 */
export async function getCompanyApplications() {
  const res = await axios.get<{ applications: IApplication[] }>(
    "http://localhost:5000/api/applications/company",
    {
      withCredentials: true,
    }
  );
  return res.data.applications;
}

/**
 * Update the status of an application.
 */
export async function updateApplicationStatus(
  applicationId: string,
  newStatus: "pending" | "in_progress" | "qualified" | "not_qualified"
) {
  await axios.patch(
    `http://localhost:5000/api/applications/${applicationId}`,
    { status: newStatus },
    {
      withCredentials: true,
    }
  );
}

/**
 * Add a new interview step to an application.
 */
export async function createStep(applicationId: string, stepName: string) {
  await axios.post(
    `http://localhost:5000/api/applications/${applicationId}/steps`,
    { stepName },
    {
      withCredentials: true,
    }
  );
}

/**
 * Update an existing interview step.
 */
export async function updateStep(
  applicationId: string,
  stepId: string,
  result: "GO" | "NO_GO" | "STILL",
  notes?: string
) {
  await axios.patch(
    `http://localhost:5000/api/applications/${applicationId}/steps/${stepId}`,
    { result, notes },
    {
      withCredentials: true,
    }
  );
}
