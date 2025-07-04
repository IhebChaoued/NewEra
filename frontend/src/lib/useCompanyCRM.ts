import { useEffect, useState } from "react";
import {
  getCompanyApplications,
  updateApplicationStatus,
  createStep,
  updateStep,
} from "../services/applicationService";
import { IApplication } from "../types/application";

/**
 * Hook to manage company CRM data and actions.
 */
export function useCompanyCRM() {
  const [applications, setApplications] = useState<IApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load all applications for the company.
   */
  async function fetchApplications() {
    try {
      setLoading(true);
      setError(null);
      const apps = await getCompanyApplications();
      setApplications(apps);
    } catch (e) {
      console.error(e);
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Change the pipeline status of an application.
   */
  async function changeStatus(
    applicationId: string,
    newStatus: IApplication["status"]
  ) {
    await updateApplicationStatus(applicationId, newStatus);
    await fetchApplications();
  }

  /**
   * Add a new interview step to an application.
   */
  async function addStep(applicationId: string, stepName: string) {
    await createStep(applicationId, stepName);
    await fetchApplications();
  }

  /**
   * Update a specific step result.
   */
  async function saveStepResult(
    applicationId: string,
    stepId: string,
    result: "GO" | "NO_GO" | "STILL",
    notes?: string
  ) {
    await updateStep(applicationId, stepId, result, notes);
    await fetchApplications();
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  return {
    applications,
    loading,
    error,
    changeStatus,
    addStep,
    saveStepResult,
    refetch: fetchApplications,
  };
}
