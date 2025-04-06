import { useRef, useState } from "react";

interface ResumeUploaderProps {
  files: File[];
  onFileChange: (files: File[]) => void;
  onFileRemove: (index: number) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  files,
  onFileChange,
  onFileRemove,
}) => {
  const resumesFileRef = useRef<HTMLInputElement>(null);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  const checkForDuplicates = (newFiles: File[]): File[] => {
    // Find duplicates by comparing with existing files
    const duplicates: string[] = [];
    const uniqueFiles = newFiles.filter((newFile) => {
      const isDuplicate = files.some(
        (existingFile) => existingFile.name === newFile.name
      );
      if (isDuplicate) {
        duplicates.push(newFile.name);
      }
      return !isDuplicate;
    });

    // Show error message if duplicates were found
    if (duplicates.length > 0) {
      const duplicateNames = duplicates.join(", ");
      const isMultiple = duplicates.length > 1;

      setDuplicateError(
        `Duplicate ${isMultiple ? "files" : "file"} skipped: ${duplicateNames}`
      );
      
      // Clear the error after 4 seconds
      setTimeout(() => setDuplicateError(null), 4000);
    }

    return uniqueFiles;
  };

  const handleResumeFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const validFiles = filesArray.filter(
        (file) =>
          file.type === "application/pdf" ||
          file.type === "application/msword" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "text/plain"
      );

      // Check for duplicates and add only unique files
      const uniqueValidFiles = checkForDuplicates(validFiles);

      if (uniqueValidFiles.length > 0) {
        onFileChange(uniqueValidFiles);
      }

      // Reset the input field to allow selecting the same file again
      if (resumesFileRef.current) {
        resumesFileRef.current.value = "";
      }
    }
  };

  const handleResumesDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      const validFiles = filesArray.filter(
        (file) =>
          file.type === "application/pdf" ||
          file.type === "application/msword" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "text/plain"
      );

      // Check for duplicates and add only unique files
      const uniqueValidFiles = checkForDuplicates(validFiles);

      if (uniqueValidFiles.length > 0) {
        onFileChange(uniqueValidFiles);
      }
    }
  };

  const handleResumesUploadClick = () => {
    resumesFileRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <div
        className={`upload-box resume-upload ${
          files.length > 0 ? "has-files" : ""
        }`}
        onClick={handleResumesUploadClick}
        onDrop={handleResumesDrop}
        onDragOver={handleDragOver}
      >
        <div className="upload-content">
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
            <span className="upload-text">
              {files.length > 0
                ? `${files.length} ${
                    files.length === 1 ? "file" : "files"
                  } selected`
                : "Upload Resumes"}
            </span>
            <span className="upload-hint">
              <span className="highlight">Select multiple</span> files:
              <span className="highlight">&nbsp;.pdf</span>,
              <span className="highlight">&nbsp;.doc</span>,
              <span className="highlight">&nbsp;.docx</span>,
              <span className="highlight">&nbsp;.txt</span>
            </span>
          </div>
        </div>
        <input
          type="file"
          ref={resumesFileRef}
          onChange={handleResumeFilesChange}
          accept=".pdf,.doc,.docx,.txt"
          multiple
          style={{ display: "none" }}
        />
      </div>

      {duplicateError && (
        <div className="file-error-message">
          <span>{duplicateError}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="files-preview">
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="file-preview-item">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="file-preview-icon"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <span className="file-preview-name">{file.name}</span>
              <button
                className="file-preview-remove"
                onClick={() => onFileRemove(index)}
                aria-label={`Remove ${file.name}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
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
          ))}
        </div>
      )}
    </>
  );
};

export default ResumeUploader;
