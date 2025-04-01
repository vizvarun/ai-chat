import { useState } from "react";
import "../styles/Tabs.css";
import "../styles/TestCaseGenerator.css";
import TestPlanView from "../components/TestPlanView";
import TestCasesTable from "../components/TestCasesTable";
import Loader from "../components/Loader";
import Breadcrumbs from "../components/Breadcrumbs";
import { GenerateResponse } from "../types/testTypes";

const TestCaseGenerator = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<GenerateResponse | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("testPlans");
  const [inputCollapsed, setInputCollapsed] = useState(false);

  // Toggle input section visibility
  const toggleInputSection = () => {
    setInputCollapsed(!inputCollapsed);
  };

  // Mock API call
  const generateTestCases = () => {
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const mockResponse: GenerateResponse = {
        testPlans: [
          {
            title: "Test Plan for " + title,
            description: "This test plan addresses: " + description,
            steps: [
              "1. Create supplier funded invoices with early pay reduction",
              "2. Verify MUM used is supplier funded",
              "3. Test early pay discount reduction types",
              "4. Verify reduction calculation logic for different invoice types",
              "5. Ensure calculations are applied against gross bill amount",
            ],
          },
        ],
        testCases: [
          {
            "Test Case ID": "1",
            "Test Case Description":
              "Verify Early Pay Reduction Calculation Logic Change for Supplier Funded Invoices",
            "Test Steps": [
              {
                "Step ID": "1",
                "Step Description":
                  "Create a supplier funded invoice with early pay reduction type",
                "Expected Result": "Invoice should be created successfully",
              },
              {
                "Step ID": "2",
                "Step Description":
                  "Verify that reduction calculation is applied against gross bill amount",
                "Expected Result": "Early pay reduction calculated correctly",
              },
            ],
            Priority: "High",
            "Test Data":
              "Supplier funded invoice with early pay reduction type",
          },
          {
            "Test Case ID": "2",
            "Test Case Description":
              "Verify MUM Used is Supplier Funded (Admin Fee Reduced from Supplier Invoice)",
            "Test Steps": [
              {
                "Step ID": "1",
                "Step Description":
                  "Create a supplier funded invoice with admin fee reduced from supplier invoice",
                "Expected Result": "Invoice should be created successfully",
              },
              {
                "Step ID": "2",
                "Step Description":
                  "Verify that MUM used is Supplier Funded (Admin Fee reduced from Supplier invoice)",
                "Expected Result": "MUM used is Supplier Funded",
              },
            ],
            Priority: "High",
            "Test Data":
              "Supplier funded invoice with admin fee reduced from supplier invoice",
          },
          {
            "Test Case ID": "3",
            "Test Case Description":
              "Verify that Early Pay Discount reduction type is applicable for supplier funded invoices",
            "Test Steps": [
              {
                "Step ID": "1",
                "Step Description":
                  "Create a supplier funded invoice with early pay discount reduction type",
                "Expected Result": "Invoice should be created successfully",
              },
              {
                "Step ID": "2",
                "Step Description":
                  "Verify that early pay discount reduction type is applicable for supplier funded invoices",
                "Expected Result":
                  "Early pay discount reduction type is applicable",
              },
            ],
            Priority: "Low",
            "Test Data":
              "Supplier funded invoice with early pay discount reduction type",
          },
          {
            "Test Case ID": "4",
            "Test Case Description":
              "Verify that no changes to early pay reduction for customer or non-supplier funded invoices",
            "Test Steps": [
              {
                "Step ID": "1",
                "Step Description":
                  "Create a customer invoice with early pay reduction type",
                "Expected Result": "Invoice should be created successfully",
              },
              {
                "Step ID": "2",
                "Step Description":
                  "Verify that no changes to early pay reduction for customer invoices",
                "Expected Result":
                  "No changes to early pay reduction for customer invoices",
              },
            ],
            Priority: "Medium",
            "Test Data": "Customer invoice with early pay reduction type",
          },
        ],
      };
      setGeneratedData(mockResponse);
      setLoading(false);
      // Auto-collapse input section when results are ready
      setInputCollapsed(true);
    }, 1500); // 1.5 seconds delay to simulate API call
  };

  return (
    <div className="tab-container">
      <Breadcrumbs />
      <div
        className={`content-area ${
          !inputCollapsed && generatedData ? "scrollable" : ""
        }`}
      >
        {generatedData && (
          <div className="input-collapse-control">
            <button
              className="collapse-toggle-btn"
              onClick={toggleInputSection}
              aria-label={
                inputCollapsed
                  ? "Expand input section"
                  : "Collapse input section"
              }
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className={`collapse-arrow ${
                  inputCollapsed ? "collapsed" : ""
                }`}
              >
                <path
                  d="M7 10L12 15L17 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {inputCollapsed ? "Show Input Fields" : "Hide Input Fields"}
            </button>
          </div>
        )}

        <div className={`input-section ${inputCollapsed ? "collapsed" : ""}`}>
          <div className="input-field">
            <label htmlFor="story-title">Enter Story Title</label>
            <input
              type="text"
              id="story-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., User Authentication Feature"
            />
          </div>

          <div className="input-field">
            <label htmlFor="story-description">Enter Story Description</label>
            <textarea
              id="story-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of the story..."
            />
          </div>

          <button
            className="generate-button"
            onClick={generateTestCases}
            disabled={loading || !title.trim() || !description.trim()}
          >
            {loading ? (
              <>
                <svg
                  className="spinner"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray="30 30"
                  />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path
                    fill="currentColor"
                    d="M19.5 5.5h-15v2h15v-2zm0 6h-15v2h15v-2zm-15 8h7v-2h-7v2z"
                  />
                  <path
                    fill="currentColor"
                    d="M16.5 17.5l2-1.5 2 1.5v-4h-4v4z"
                  />
                </svg>
                Generate Test Cases
              </>
            )}
          </button>
        </div>

        {loading && (
          <div className="loading">
            <Loader size="medium" />
            <p>Generating test cases, please wait...</p>
          </div>
        )}

        {!loading && generatedData && (
          <div className="results-section">
            <div className="tabs-header">
              <button
                className={`tab-button ${
                  activeTab === "testPlans" ? "active" : ""
                }`}
                onClick={() => setActiveTab("testPlans")}
                style={{ outline: "none" }}
              >
                Test Plans
              </button>
              <button
                className={`tab-button ${
                  activeTab === "testCases" ? "active" : ""
                }`}
                onClick={() => setActiveTab("testCases")}
                style={{ outline: "none" }}
              >
                Test Cases
              </button>
            </div>

            <div className="tab-content">
              {activeTab === "testPlans" && (
                <TestPlanView testPlan={generatedData.testPlans[0]} />
              )}

              {activeTab === "testCases" && (
                <TestCasesTable testCases={generatedData.testCases} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCaseGenerator;
