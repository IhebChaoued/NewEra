import { useEffect, useState, useCallback } from "react";
import {
  getApplicationsForCompany,
  updateApplicationStatus,
  createStepResult,
  updateStepResult,
} from "../services/applicationService";
import { IApplication, ICustomField } from "../types/application";
import { useCompanyAuthStore } from "../store/companyAuthStore";

/**
 * Hook to manage company CRM data and actions.
 */
export function useCompanyCRM() {
  const token = useCompanyAuthStore((state) => state.token);

  const [applications, setApplications] = useState<IApplication[]>([]);
  const [customFields, setCustomFields] = useState<ICustomField[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load applications belonging to the logged-in company.
   */
  const fetchApplications = useCallback(async () => {
    try {
      if (!token) return;
      setLoading(true);
      setError(null);

      // Fetch BOTH applications + customFields
      const { applications, customFields } = await getApplicationsForCompany(
        token
      );
      setApplications(applications);
      setCustomFields(customFields);
    } catch (e) {
      console.error(e);
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  /**
   * Change the overall status of an application.
   */
  async function changeStatus(
    applicationId: string,
    newStatus: IApplication["status"]
  ) {
    if (!token) return;
    await updateApplicationStatus(applicationId, newStatus, token);
    await fetchApplications();
  }

  /**
   * Create a new step in an application's process.
   */
  async function addStep(applicationId: string, stepTitle: string) {
    if (!token) return;
    await createStepResult(applicationId, stepTitle, token);
    await fetchApplications();
  }

  /**
   * Update the result of an existing step in an application.
   */
  async function saveStepResult(
    applicationId: string,
    stepId: string | undefined,
    result: "GO" | "NO_GO" | "STILL" | "",
    notes?: string
  ) {
    if (!token || !stepId) return;
    await updateStepResult(applicationId, stepId, result, notes || "", token);
    await fetchApplications();
  }

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    customFields,
    loading,
    error,
    changeStatus,
    addStep,
    saveStepResult,
    refetch: fetchApplications,
  };
}
