/**
 * Auth Configuration
 *
 * This file contains configuration for authentication including:
 * - List of authorized emails that can access all features
 * - Test login credentials for development/testing purposes
 */

// List of email addresses authorized to use the Test Case Generator
export const AUTHORIZED_EMAILS = [
  "john.doe@magnitglobal.com",
  "jane.smith@magnitglobal.com",
  "dev.team@magnitglobal.com",
  "qa.tester@magnitglobal.com",
  "product.owner@magnitglobal.com",
  "tech.lead@magnitglobal.com",
  "project.manager@magnitglobal.com",
  "scrum.master@magnitglobal.com",
  "varun.vishal@magnitglobal.com",
];

// Test credentials for development - DO NOT USE IN PRODUCTION
export const TEST_CREDENTIALS = [
  {
    email: "john.doe@magnitglobal.com",
    password: "Test@123",
    name: "John Doe",
    role: "Developer",
  },
  {
    email: "jane.smith@magnitglobal.com",
    password: "Test@456",
    name: "Jane Smith",
    role: "QA Engineer",
  },
  {
    email: "qa.tester@magnitglobal.com",
    password: "Tester@789",
    name: "QA Tester",
    role: "QA Engineer",
  },
];
