import axios from "axios";
import { ICustomField, IApplication } from "../types/application";

const API_URL = "http://localhost:5000/api/custom-fields";

export const customFieldService = {
  /**
   * Get all custom fields for the logged-in company.
   */
  async list(token: string): Promise<ICustomField[]> {
    const res = await axios.get<ICustomField[]>(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  /**
   * Create a new custom field definition.
   */
  async create(field: Partial<ICustomField>, token: string) {
    const res = await axios.post<ICustomField>(API_URL, field, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  /**
   * Delete a custom field.
   */
  async delete(id: string, token: string) {
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  /**
   * Update custom field values for an application.
   */
  async updateApplicationCustomFields(
    appId: string,
    customFields: Record<string, unknown>,
    token: string
  ): Promise<IApplication> {
    const res = await axios.patch<IApplication>(
      `http://localhost:5000/api/applications/${appId}/custom-fields`,
      { customFields },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  },
};
