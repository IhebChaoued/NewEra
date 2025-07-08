/**
 * User info on an application.
 */
export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

/**
 * Job info on an application.
 */
export interface IJob {
  _id: string;
  title: string;
}

/**
 * A single interview step in an application pipeline.
 */
export interface IApplicationStep {
  _id?: string;
  name: string;
  result: "GO" | "NO_GO" | "STILL" | "";
  notes?: string;
}

/**
 * Application record submitted by a user to a job.
 */
export interface IApplication {
  _id: string;
  userId: IUser;
  jobId: IJob;
  message: string;
  status: "pending" | "in_progress" | "qualified" | "not_qualified";
  cvUrl?: string;
  steps: IApplicationStep[];
  customFields: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Custom field definition for a company.
 */
export interface ICustomField {
  _id: string;
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string | number | boolean | null;
}
