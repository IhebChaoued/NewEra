import { useEffect, useState, useCallback } from "react";
import {
  getApplicationsForCompany,
  updateApplicationStatus,
  createOrUpdateStepResult,
} from "../services/applicationService";
import { IApplication } from "../types/application";
import { useCompanyAuthStore } from "../store/companyAuthStore";

/**
 * Hook to manage company CRM data and actions.
 */
export function useCompanyCRM() {
  const token = useCompanyAuthStore((state) => state.token);

  const [applications, setApplications] = useState<IApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch applications for the company
  const fetchApplications = useCallback(async () => {
    try {
      if (!token) return;
      setLoading(true);
      setError(null);
      const apps = await getApplicationsForCompany(token);
      setApplications(apps);
    } catch (e) {
      console.error(e);
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Change application status
  async function changeStatus(
    applicationId: string,
    newStatus: IApplication["status"]
  ) {
    if (!token) return;
    await updateApplicationStatus(applicationId, newStatus, token);
    await fetchApplications();
  }

  // Create a new step in an application
  async function addStep(applicationId: string, stepTitle: string) {
    if (!token) return;
    await createOrUpdateStepResult(
      applicationId,
      {
        name: stepTitle,
        result: "",
      },
      token
    );
    await fetchApplications();
  }

  // Save/update a step result
  async function saveStepResult(
    applicationId: string,
    stepId: string | undefined,
    result: "GO" | "NO_GO" | "STILL" | "",
    notes?: string
  ) {
    if (!token) return;
    await createOrUpdateStepResult(
      applicationId,
      {
        stepId,
        name: "", // empty since we only update result
        result,
        notes,
      },
      token
    );
    await fetchApplications();
  }

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

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
