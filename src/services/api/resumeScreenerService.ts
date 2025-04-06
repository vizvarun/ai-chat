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
      console.log("API: rankResumes called", {
        jobDescription,
        criteria,
        resumeFiles: resumeFiles.length,
      });

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
      console.error("API Error: rankResumes", error);
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
      console.log("API: submitJobDescription called", {
        jobDescriptionLength: jobDescription.length,
        criteriaLength: criteria.length,
        hasFile: !!jobDescriptionFile,
      });

      // Simulate API call with delay
      await randomDelay(1000, 2000);

      // Mock response
      const response = {
        success: true,
        jobDescriptionId: "jd-" + Math.floor(Math.random() * 10000).toString(),
        message: "Job description processed successfully",
      };

      console.log("API: submitJobDescription response", response);
      return response;
    } catch (error) {
      console.error("API Error: submitJobDescription", error);
      throw error;
    }
  },

  // Process a single resume - removing jobDescriptionId from parameters
  processResume: async (
    resumeFile: File,
    index: number
  ): Promise<ResumeProcessingResponse> => {
    try {
      console.log(`API: processResume called for index ${index}`, {
        fileName: resumeFile.name,
      });

      // Simulate API call with variable delay to make responses realistic
      await randomDelay(2000, 5000);

      // Generate random score between 50-95
      const matchScore = Math.floor(Math.random() * 45) + 50;

      // Generate dummy response data
      const response = {
        success: true,
        resumeId: `resume-${index}-${Math.floor(Math.random() * 10000)}`,
        fileName: resumeFile.name,
        candidateId: `cand-${Math.floor(Math.random() * 10000)}`,
        candidateName: `Candidate ${index + 1}`,
        matchScore: matchScore,
        rank: index + 1, // Ensure rank is at least 1, never 0
        overallScore: matchScore * 0.9 + Math.floor(Math.random() * 10),
        resumeSummary: `This candidate has ${
          Math.floor(Math.random() * 10) + 1
        } years of experience in relevant field with expertise in various technologies.`,
        parsedResume: `Full resume content would appear here...
Skills: JavaScript, React, TypeScript, Node.js
Experience: ${Math.floor(Math.random() * 10) + 1} years
Education: Bachelor's in Computer Science`,
      };

      console.log(`API: processResume response for index ${index}`, {
        resumeId: response.resumeId,
        matchScore: response.matchScore,
      });

      return response;
    } catch (error) {
      console.error(`API Error: processResume for index ${index}`, error);
      throw error;
    }
  },

  // Final ranking call to sort and update all processed resumes
  getFinalRanking: async (
    jobDescriptionId: string,
    resumeIds: string[]
  ): Promise<FinalRankingResponse> => {
    try {
      console.log("API: getFinalRanking called", {
        jobDescriptionId,
        resumeCount: resumeIds.length,
      });

      // Simulate API call
      await randomDelay(1500, 2500);

      // Return a success response
      const response = {
        success: true,
        message: "Resumes ranked successfully",
        rankingCompleted: true,
      };

      console.log("API: getFinalRanking response", response);
      return response;
    } catch (error) {
      console.error("API Error: getFinalRanking", error);
      throw error;
    }
  },
};
