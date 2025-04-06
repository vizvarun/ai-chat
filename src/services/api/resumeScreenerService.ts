import axiosInstance from "./axios";
import { API_ENDPOINTS } from "../../config/env";
import { RankedCandidatesResponse } from "../../types/resumeTypes";

export const resumeScreenerService = {
  rankResumes: async (
    jobDescription: string,
    criteria: string,
    jobDescriptionFile: File | null,
    resumeFiles: File[]
  ): Promise<RankedCandidatesResponse> => {
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append("jobDescription", jobDescription);
      if (jobDescriptionFile) {
        formData.append("jobDescriptionFile", jobDescriptionFile);
      }
      formData.append("criteria", criteria);

      // Append all resume files
      resumeFiles.forEach((file, index) => {
        formData.append(`resume${index}`, file);
      });

      // Make API call
      const response = await axiosInstance.post<RankedCandidatesResponse>(
        API_ENDPOINTS.RANK_RESUMES,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
