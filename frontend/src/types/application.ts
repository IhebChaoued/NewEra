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
  userId: string;
  jobId: string;
  message: string;
  status: "pending" | "in_progress" | "qualified" | "not_qualified";
  cvUrl?: string;
  steps: IApplicationStep[];
  createdAt?: string;
  updatedAt?: string;
}
