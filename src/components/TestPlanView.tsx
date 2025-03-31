import { TestPlan, TestPlanViewProps } from "../types/testTypes";
import "../styles/TestPlanView.css";

const TestPlanView: React.FC<TestPlanViewProps> = ({ testPlan }) => {
  return (
    <div className="test-plans">
      <div className="test-plan-header">
        <h3 className="test-plan-title">{testPlan.title}</h3>
        <p className="test-plan-description">{testPlan.description}</p>
      </div>
      <div className="test-plan-steps">
        <div className="steps-header">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
