import axios from "axios";
import { IApplication } from "../types/application";

const API_URL = "http://localhost:5000/api/applications";

/**
 * Fetches all applications for the logged-in company.
 */
export const getApplicationsForCompany = async (token: string) => {
  const res = await axios.get<{ applications: IApplication[] }>(
    `${API_URL}/company`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.applications;
};

/**
 * Updates the status of an application (e.g. move between stages).
 */
export const updateApplicationStatus = async (
  appId: string,
  status: "pending" | "in_progress" | "qualified" | "not_qualified",
  token: string
) => {
  const res = await axios.patch<{ application: IApplication }>(
    `${API_URL}/${appId}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.application;
};

/**
 * Creates a new step for an application.
 */
export const createStepResult = async (
  appId: string,
  stepName: string,
  token: string
) => {
  const res = await axios.post<{ application: IApplication }>(
    `${API_URL}/${appId}/steps`,
    { name: stepName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.application;
};

/**
 * Updates an existing step result for an application.
 */
export const updateStepResult = async (
  appId: string,
  stepId: string,
  result: "GO" | "NO_GO" | "STILL" | "",
  comment: string,
  token: string
) => {
  const res = await axios.patch<{ application: IApplication }>(
    `${API_URL}/${appId}/steps/${stepId}`,
    { result, comment },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.application;
};
