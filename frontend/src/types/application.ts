/**
 * User info on an application.
 */
export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
}

/**
 * Job info on an application.
 */
export interface IJob {
  _id: string;
  title: string;
}

/**
 * One step in a recruitment pipeline.
 */
export interface IApplicationStep {
  _id?: string;
  name: string;
  result: "GO" | "NO_GO" | "STILL" | "";
  notes?: string;
}

/**
 * Defines one custom field for a company.
 */
export interface ICustomField {
  _id: string;
  name: string;
  fieldType: "text" | "number" | "date" | "select";
  options?: string[];
}

/**
 * Represents a custom field and its value on an application.
 */
export interface ICustomFieldValue extends ICustomField {
  value: string | number | null;
}

/**
 * An application record.
 */
export interface IApplication {
  _id: string;
  userId: IUser;
  jobId: IJob;
  message: string;
  status: "pending" | "in_progress" | "qualified" | "not_qualified";
  cvUrl?: string;
  steps: IApplicationStep[];
  customFields: ICustomFieldValue[];
  createdAt?: string;
  updatedAt?: string;
}

export type CustomFieldValue = string | number | null;
