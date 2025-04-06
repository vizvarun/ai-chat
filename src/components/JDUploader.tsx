import { useRef } from "react";

interface JDUploaderProps {
  file: File | null;
  onFileChange: (file: File) => void;
  onClearFile: () => void;
}

const JDUploader: React.FC<JDUploaderProps> = ({
  file,
  onFileChange,
  onClearFile,
}) => {
  const jobDescriptionFileRef = useRef<HTMLInputElement>(null);

  const handleJobDescriptionFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      onFileChange(selectedFile);
      
      // Reset the input field to allow selecting the same file again
      if (jobDescriptionFileRef.current) {
        jobDescriptionFileRef.current.value = "";
      }
    }
  };

  const handleJobDescriptionUploadClick = () => {
    jobDescriptionFileRef.current?.click();
  };

  const handleJobDescriptionDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0];

      // Accept more file types
      if (
        selectedFile.type === "application/pdf" ||
        selectedFile.type === "text/plain" ||
        selectedFile.type === "application/msword" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        onFileChange(selectedFile);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      className={`upload-box ${file ? "has-file" : ""}`}
      onClick={handleJobDescriptionUploadClick}
      onDrop={handleJobDescriptionDrop}
      onDragOver={handleDragOver}
    >
      {file ? (
        <>
          <div className="file-info">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="file-icon"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            <span className="file-name">{file.name}</span>
          </div>
          <div className="file-actions">
            <button
              className="change-file-btn"
              onClick={(e) => {
                e.stopPropagation();
                jobDescriptionFileRef.current?.click();
              }}
            >
              Change
            </button>
            <button
              className="clear-file-btn"
              onClick={(e) => {
                e.stopPropagation();
                onClearFile();
              }}
              title="Remove file"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="upload-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div className="upload-prompt">
            <span className="upload-text">Upload JD file</span>
            <span className="upload-hint">
              Accept <span className="highlight">.pdf</span>,{" "}
              <span className="highlight">.doc</span>,{" "}
              <span className="highlight">.docx</span>,{" "}
              <span className="highlight">.txt</span>
            </span>
          </div>
        </>
      )}
      <input
        type="file"
        ref={jobDescriptionFileRef}
        onChange={handleJobDescriptionFileChange}
        accept=".pdf,.txt,.doc,.docx"
        style={{ display: "none" }}
      />
    </div>
  );
};

export default JDUploader;
