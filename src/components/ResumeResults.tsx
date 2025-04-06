import { Candidate } from "../types/resumeTypes";

interface ResumeResultsProps {
  candidates: Candidate[] | undefined;
}

const ResumeResults: React.FC<ResumeResultsProps> = ({ candidates }) => {
  if (!candidates || candidates.length === 0) {
    return (
      <div className="empty-results">
        <p>No matching candidates found. Try adjusting your criteria.</p>
      </div>
    );
  }

  return (
    <div className="candidates-list">
      {candidates.map((candidate, index) => (
        <div key={index} className="candidate-card">
          <div className="candidate-header">
            <h4 className="candidate-name">{candidate.name}</h4>
            <div className="match-score">
              {Math.round(candidate.matchScore)}% Match
            </div>
          </div>
          <div className="candidate-details">
            <p className="candidate-summary">{candidate.summary}</p>

            {candidate.highlights && candidate.highlights.length > 0 && (
              <div className="candidate-highlights">
                <h5>Highlights</h5>
                <ul>
                  {candidate.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}

            {candidate.missingSkills && candidate.missingSkills.length > 0 && (
              <div className="missing-skills">
                <h5>Skill Gaps</h5>
                <ul>
                  {candidate.missingSkills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResumeResults;
