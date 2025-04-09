import axiosInstance from "./axios";
import { API_ENDPOINTS } from "../../config/env";
import {
  RankedCandidatesResponse,
  JobDescriptionResponse,
  ResumeProcessingResponse,
  FinalRankingResponse,
} from "../../types/resumeTypes";

// Helper for random delay to simulate API call
const randomDelay = (min = 800, max = 3000) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

export const resumeScreenerService = {
  // Original function kept for compatibility
  rankResumes: async (
    jobDescription: string,
    criteria: string,
    jobDescriptionFile: File | null,
    resumeFiles: File[]
  ): Promise<RankedCandidatesResponse> => {
    try {
      console.log("API REQUEST: rankResumes", {
        endpoint: API_ENDPOINTS.RANK_RESUMES,
        jobDescriptionLength: jobDescription.length,
        criteriaLength: criteria.length,
        hasJobDescFile: !!jobDescriptionFile,
        resumeCount: resumeFiles.length,
        resumeNames: resumeFiles.map((f) => f.name),
      });

      // Create form data for file upload
      const formData = new FormData();
      formData.append("jobDescription", jobDescription);
      if (jobDescriptionFile) {
        formData.append("file", jobDescriptionFile);
      }
      formData.append("criteria", criteria);

      // Append all resume files
      resumeFiles.forEach((file, index) => {
        formData.append(`resume${index}`, file);
      });

      // Make API call
      console.log(`API CALLING: ${API_ENDPOINTS.RANK_RESUMES}`);
      const response = await axiosInstance.post<RankedCandidatesResponse>(
        API_ENDPOINTS.RANK_RESUMES,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API RESPONSE: rankResumes", {
        endpoint: API_ENDPOINTS.RANK_RESUMES,
        status: response.status,
        success: response.data?.success,
        candidatesCount: response.data.rankedCandidates?.length || 0,
      });

      return response.data;
    } catch (error: any) {
      console.error("API ERROR: rankResumes", {
        endpoint: API_ENDPOINTS.RANK_RESUMES,
        error: error.message,
        status: error.response?.status,
        details: error.response?.data,
      });
      throw error;
    }
  },

  // New function to submit job description and get jobDescriptionId
  submitJobDescription: async (
    jobDescription: string,
    criteria: string,
    jobDescriptionFile: File | null
  ): Promise<JobDescriptionResponse> => {
    try {
      console.log("API REQUEST: submitJobDescription", {
        endpoint: API_ENDPOINTS.PARSE_JOB_DESCRIPTION,
        jobDescriptionLength: jobDescription.length,
        criteriaLength: criteria.length,
        hasFile: !!jobDescriptionFile,
        fileName: jobDescriptionFile?.name,
      });

      // Create form data for job description submission
      const formData = new FormData();
      if (jobDescriptionFile) {
        formData.append("file", jobDescriptionFile);
      } else {
        // If no file is provided, submit the text as description
        formData.append("description", jobDescription);
      }
      formData.append("criteria", criteria);

      // Make actual API call instead of mock
      console.log(`API CALLING: ${API_ENDPOINTS.PARSE_JOB_DESCRIPTION}`);
      const response = await axiosInstance.post<JobDescriptionResponse>(
        API_ENDPOINTS.PARSE_JOB_DESCRIPTION,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API RESPONSE: submitJobDescription", {
        endpoint: API_ENDPOINTS.PARSE_JOB_DESCRIPTION,
        status: response.status,
        success: response.data.success,
        jobDescriptionId: response.data.jobDescriptionId,
        message: response.data.message,
      });

      return response.data;
    } catch (error: any) {
      console.error("API ERROR: submitJobDescription", {
        endpoint: API_ENDPOINTS.PARSE_JOB_DESCRIPTION,
        error: error.message,
        status: error.response?.status,
        details: error.response?.data,
      });
      throw error;
    }
  },

  // Process a single resume - removing jobDescriptionId from parameters
  processResume: async (
    resumeFile: File,
    index: number
  ): Promise<ResumeProcessingResponse> => {
    try {
      console.log("API REQUEST: processResume", {
        endpoint: API_ENDPOINTS.PARSE_RESUME,
        fileName: resumeFile.name,
        fileSize: resumeFile.size,
        fileType: resumeFile.type,
        index: index,
      });

      // Create form data for resume submission
      const formData = new FormData();
      formData.append("file", resumeFile);
      // formData.append("index", index.toString());

      // Make actual API call instead of mock
      console.log(`API CALLING: ${API_ENDPOINTS.PARSE_RESUME}`);
      const response = await axiosInstance.post<ResumeProcessingResponse>(
        API_ENDPOINTS.PARSE_RESUME,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API RESPONSE: processResume", {
        endpoint: API_ENDPOINTS.PARSE_RESUME,
        status: response.status,
        success: response.data.success,
        resumeId: response.data.resumeId,
        candidateId: response.data.candidateId,
        candidateName: response.data.candidateName,
        matchScore: response.data.matchScore,
        index: index,
      });

      return response.data;
    } catch (error: any) {
      console.error("API ERROR: processResume", {
        endpoint: API_ENDPOINTS.PARSE_RESUME,
        fileName: resumeFile.name,
        index: index,
        error: error.message,
        status: error.response?.status,
        details: error.response?.data,
      });

      // Create a more user-friendly error with additional context
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred processing this resume";
      const enhancedError: any = new Error(errorMessage);

      // Add properties that will be helpful for the UI
      enhancedError.resumeFileName = resumeFile.name;
      enhancedError.resumeIndex = index;
      enhancedError.status = error.response?.status || 500;
      enhancedError.isResumeProcessingError = true; // Flag to identify this specific type of error

      // Add a UI-friendly error message
      enhancedError.displayMessage = `Failed to process "${resumeFile.name}": ${errorMessage}`;

      throw enhancedError;
    }
  },

  // Final ranking call to sort and update all processed resumes
  getFinalRanking: async (
    jobDescriptionId: string,
    resumeIds: string[]
  ): Promise<FinalRankingResponse> => {
    try {
      console.log("API REQUEST: getFinalRanking", {
        endpoint: API_ENDPOINTS.RANK_RESUMES,
        jobDescriptionId: jobDescriptionId,
        resumeCount: resumeIds.length,
        resumeIds: resumeIds,
      });

      // Create request data for final ranking
      const requestData = {
        jobDescriptionId,
        resumeIds,
      };

      // Make actual API call instead of mock
      console.log(`API CALLING: ${API_ENDPOINTS.RANK_RESUMES}`);
      const response = await axiosInstance.post<FinalRankingResponse>(
        API_ENDPOINTS.RANK_RESUMES,
        requestData
      );

      console.log("API RESPONSE: getFinalRanking", {
        endpoint: API_ENDPOINTS.RANK_RESUMES,
        status: response.status,
        success: response.data.success,
        message: response.data.message,
        rankingCompleted: response.data.rankingCompleted,
      });

      return response.data;
    } catch (error: any) {
      console.error("API ERROR: getFinalRanking", {
        endpoint: API_ENDPOINTS.RANK_RESUMES,
        jobDescriptionId: jobDescriptionId,
        resumeCount: resumeIds.length,
        error: error.message,
        status: error.response?.status,
        details: error.response?.data,
      });
      throw error;
    }
  },

  // Add new method for final ranking with responses
  rankResumesWithResponses: async (payload: {
    request: any; // Complete response from parse-job-maggi
    resumes: any[]; // Array of responses from parse-resume-maggi
  }): Promise<RankedCandidatesResponse> => {
    try {
      console.log("API REQUEST: rankResumesWithResponses", {
        endpoint: API_ENDPOINTS.RANK_RESUMES,
        jobDescriptionId: payload.request?.jobDescriptionId,
        resumeCount: payload.resumes?.length || 0,
      });

      // Make API call with the new payload structure
      console.log(`API CALLING: ${API_ENDPOINTS.RANK_RESUMES}`);
      const response = await axiosInstance.post<RankedCandidatesResponse>(
        API_ENDPOINTS.RANK_RESUMES,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API RESPONSE: rankResumesWithResponses", {
        endpoint: API_ENDPOINTS.RANK_RESUMES,
        status: response.status,
        success: response.data?.success,
        candidatesCount: response.data.rankedCandidates?.length || 0,
      });

      return response.data;
    } catch (error: any) {
      console.error("API ERROR: rankResumesWithResponses", {
        endpoint: API_ENDPOINTS.RANK_RESUMES,
        error: error.message,
        status: error.response?.status,
        details: error.response?.data,
      });
      throw error;
    }
  },
};
