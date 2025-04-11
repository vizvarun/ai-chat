import { API_ENDPOINTS } from "../../config/env";
import {
  JobDescriptionResponse,
  RankedCandidatesResponse,
  ResumeProcessingResponse,
} from "../../types/resumeTypes";
import axiosInstance from "./axios";

// Updated cache to hold multiple entries
let explanationCache: { [cacheKey: string]: any } = {};

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

  // Updated function to submit job description and get jobDescriptionId
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

      let response;

      if (jobDescriptionFile) {
        // File exists - use FormData
        const formData = new FormData();
        formData.append("file", jobDescriptionFile);
        formData.append("criteria", criteria);

        response = await axiosInstance.post<JobDescriptionResponse>(
          API_ENDPOINTS.PARSE_JOB_DESCRIPTION,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // No file - send plain text in body
        response = await axiosInstance.post<JobDescriptionResponse>(
          API_ENDPOINTS.PARSE_JOB_DESCRIPTION_TEXT,
          jobDescription, // send plain text directly
          {
            headers: { "Content-Type": "text/plain" },
          }
        );
      }

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
      const response = await axiosInstance.post<ResumeProcessingResponse>(
        API_ENDPOINTS.PARSE_RESUME,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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

  // New function to explain candidate match with caching
  explainCandidateMatch: async (
    jdResponse: any, // The complete job description response object
    parsedResumeData: any, // The parsed resume data
    score: number // Added score parameter
  ): Promise<any> => {
    try {
      const resumeId = parsedResumeData.resumeId || parsedResumeData.id;
      const cacheKey = `${jdResponse.jobDescriptionId}_${resumeId}_${score}`;
      if (explanationCache[cacheKey]) {
        console.log("Returning cached explanation for key:", cacheKey);
        return explanationCache[cacheKey];
      }

      console.log("API REQUEST: explainCandidateMatch", {
        endpoint: API_ENDPOINTS.EXPLAIN_RESUME,
        jobDescriptionId: jdResponse.jobDescriptionId,
        resumeId: resumeId,
        score: score,
      });

      const response = await axiosInstance.post(API_ENDPOINTS.EXPLAIN_RESUME, {
        request: jdResponse, // JD response object
        resume: parsedResumeData, // Parsed resume data
        score: score, // Score of that row
        question:
          "Explain the match category for the candidate from experience, skills, and education.", // Hardcoded question
      });

      console.log("API RESPONSE: explainCandidateMatch", {
        endpoint: API_ENDPOINTS.EXPLAIN_RESUME,
        status: response.status,
      });

      // Cache the response keyed by cacheKey
      explanationCache[cacheKey] = response.data;
      return response.data;
    } catch (error: any) {
      console.error("API ERROR: explainCandidateMatch", {
        endpoint: API_ENDPOINTS.EXPLAIN_RESUME,
        error: error.message,
        status: error.response?.status,
        details: error.response?.data,
      });
      throw error;
    }
  },

  // New method to clear the explanation cache (to be called when rank resumes is hit)
  clearExplanationCache: () => {
    explanationCache = {};
    console.log("Explanation cache cleared.");
  },
};
