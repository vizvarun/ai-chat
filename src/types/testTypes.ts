export interface TestPlan {
  title: string;
  description: string;
  steps: string[];
}

export interface TestStep {
  "Step ID": string;
  "Step Description": string;
  "Expected Result": string;
}

export interface TestCase {
  "Test Case ID": string | number;
  "Test Case Description": string;
  "Test Steps": TestStep[];
  Priority: string;
  "Test Data": string | {};
}

export interface GenerateResponse {
  testPlans?: TestPlan[];
  testCases: TestCase[];
  testExecutionPlan?: string; // Add this new field for the execution plan string
}

// Add component props interfaces
export interface TestCasesTableProps {
  testCases: TestCase[];
}

export interface TestPlanViewProps {
  testPlan?: TestPlan;
  executionPlan?: string; // Add this to support the execution plan string
}
