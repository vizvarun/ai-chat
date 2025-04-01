import { TestPlanViewProps } from "../types/testTypes";
import "../styles/TestPlanView.css";

const TestPlanView: React.FC<TestPlanViewProps> = ({
  testPlan,
  executionPlan,
}) => {
  // If we have an execution plan string, display it with proper formatting
  if (executionPlan) {
    return (
      <div className="test-plans minimal">
        <div className="test-plan-header">
          <h3 className="test-plan-title">Test Execution Plan</h3>
        </div>
        <div className="test-plan-execution">
          {/* Render HTML content safely using dangerouslySetInnerHTML */}
          <div
            className="execution-plan-content"
            dangerouslySetInnerHTML={{ __html: executionPlan }}
          />
        </div>
      </div>
    );
  }

  // If no plan is provided
  if (!testPlan) {
    return (
      <div className="test-plans empty-test-plan minimal">
        <p>No test plan is available</p>
      </div>
    );
  }

  // Original rendering for test plan object
  return (
    <div className="test-plans minimal">
      <div className="test-plan-header">
        <h3 className="test-plan-title">{testPlan.title}</h3>
        <p className="test-plan-description">{testPlan.description}</p>
      </div>
      <div className="test-plan-steps">
        <div className="steps-header">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="steps-icon"
          >
            <path
              d="M9 6L15 12L9 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Test Steps
        </div>
        <ul className="steps-list">
          {testPlan.steps.map((step, index) => (
            <li key={index} className="step-item">
              {step}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TestPlanView;
