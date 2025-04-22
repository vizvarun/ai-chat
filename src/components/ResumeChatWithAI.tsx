import { useState, useRef, useEffect } from "react";
import "../styles/ChatWithAI.css";
import { MessageType, SpeakingStateRecord } from "../types/chatTypes";
import axiosInstance from "../services/api/axios";
import { API_CONFIG, API_ENDPOINTS } from "../config/env";
import { markdownToHtml } from "../utils/textProcessing";
import { ResumeResultRow } from "../types/resumeTypes";

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
  error?: string;
}

interface ResumeChatWithAIProps {
  apiEndpoint?: string;
  useQueryParam?: boolean;
  onError?: (error: any) => void;
  initialMessages?: MessageType[];
  chatProps?: {
    resumeResults: ResumeResultRow[];
    selectedResumeIds: string[];
    onResumeSelect: (resumeId: string | null) => void;
    jobId?: string; // Add jobId to access the job description ID
  };
}

const ToggleButton = ({
  isCollapsed,
  onClick,
}: {
  isCollapsed: boolean;
  onClick: () => void;
}) => (
  <button
    className="pills-toggle-button"
    onClick={onClick}
    title={isCollapsed ? "Show all resume pills" : "Collapse resume pills"}
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
      className={`toggle-arrow ${isCollapsed ? "collapsed" : ""}`}
    >
      <path d="M18 15l-6-6-6 6" />
    </svg>
    {isCollapsed ? "Show Resumes" : "Hide Resumes"}
  </button>
);

const ResumeChatWithAI: React.FC<ResumeChatWithAIProps> = ({
  apiEndpoint = API_ENDPOINTS.CHAT_AI,
  useQueryParam = true,
  onError,
  initialMessages = [],
  chatProps,
}) => {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<SpeakingStateRecord>({});
  const [isListening, setIsListening] = useState(false);
  const [pillsCollapsed, setPillsCollapsed] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition: any =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(Object.values(event.results))
          .map((result) => result[0]?.transcript || "")
          .join("");

        setInputMessage(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: { error?: string }) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      inputRef.current?.focus();
    }
  }, [isLoading, messages.length]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const togglePillsCollapsed = () => {
    setPillsCollapsed((prev) => !prev);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessageId = `msg-${Date.now()}-user`;
    const newUserMessage: MessageType = {
      id: userMessageId,
      text: inputMessage,
      sender: "user",
    };

    const botMessageId = `msg-${Date.now()}-bot`;
    const loadingBotMessage: MessageType = {
      id: botMessageId,
      text: "",
      sender: "bot",
      loading: true,
    };

    setMessages((prev) => [...prev, newUserMessage, loadingBotMessage]);
    setInputMessage("");
    setIsLoading(true);

    let url = apiEndpoint;
    const params = new URLSearchParams();

    if (useQueryParam) {
      params.append("content", newUserMessage.text);
      url = `${apiEndpoint}?${params.toString()}`;

      // Convert string resume IDs to numbers
      const resumeIdsAsNumbers =
        chatProps?.selectedResumeIds
          .map((id) => parseInt(id, 10))
          .filter((id) => !isNaN(id)) || [];

      // Convert job ID to number with fallback to 0 if invalid
      let jobIdAsNumber = 0;
      if (chatProps?.jobId) {
        const parsed = parseInt(chatProps.jobId, 10);
        if (!isNaN(parsed)) {
          jobIdAsNumber = parsed;
        }
      }

      // Create payload with numeric IDs
      const requestBody = {
        payload: {
          resume_ids: resumeIdsAsNumbers,
          job_id: jobIdAsNumber,
        },
      };

      axiosInstance
        .post(url, requestBody, {
          timeout: API_CONFIG.TIMEOUT,
        })
        .then((response) => {
          const responseText =
            response?.data?.choices?.[0]?.message?.content ||
            "Sorry, I couldn't process your request.";
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId
                ? {
                    id: botMessageId,
                    text: responseText,
                    sender: "bot",
                    loading: false,
                  }
                : msg
            )
          );
        })
        .catch((error) => {
          console.error("Error getting chat response:", error);
          if (onError) {
            onError(error);
          }
          const errorMessage =
            error.code === "ECONNABORTED"
              ? "The request timed out. Please try again later."
              : "Sorry, there was an error processing your request. Please try again.";

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId
                ? {
                    id: botMessageId,
                    text: errorMessage,
                    sender: "bot",
                    loading: false,
                  }
                : msg
            )
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      const requestBody = {
        content: newUserMessage.text,
        payload: {
          resume_ids:
            chatProps?.selectedResumeIds
              .map((id) => parseInt(id, 10))
              .filter((id) => !isNaN(id)) || [],
          job_id: chatProps?.jobId ? parseInt(chatProps.jobId, 10) || 0 : 0,
        },
      };
      axiosInstance
        .post(apiEndpoint, requestBody, {
          timeout: API_CONFIG.TIMEOUT,
        })
        .then((response) => {
          const responseText =
            response?.data?.choices?.[0]?.message?.content ||
            "Sorry, I couldn't process your request.";
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId
                ? {
                    id: botMessageId,
                    text: markdownToHtml(responseText),
                    sender: "bot",
                    loading: false,
                  }
                : msg
            )
          );
        })
        .catch((error) => {
          console.error("Error getting chat response:", error);
          if (onError) {
            onError(error);
          }
          const errorMessage =
            error.code === "ECONNABORTED"
              ? "The request timed out. Please try again later."
              : "Sorry, there was an error processing your request. Please try again.";

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId
                ? {
                    id: botMessageId,
                    text: errorMessage,
                    sender: "bot",
                    loading: false,
                  }
                : msg
            )
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log("Copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy using navigator.clipboard: ", err);
        });
    } else {
      // Fallback method using temporary textarea
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        console.log("Copied to clipboard using fallback");
      } catch (err) {
        console.error("Fallback copy failed: ", err);
      }
      document.body.removeChild(textarea);
    }
  };

  const handleFeedback = (type: "good" | "bad", messageId: string) => {
    console.log(`User gave ${type} feedback for message ${messageId}`);
  };

  const handleTextToSpeech = (text: string, messageId: string) => {
    if ("speechSynthesis" in window) {
      if (isSpeaking[messageId]) {
        window.speechSynthesis.cancel();
        setIsSpeaking((prev) => ({ ...prev, [messageId]: false }));
        return;
      }
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";

      setIsSpeaking((prev) => ({ ...prev, [messageId]: true }));

      utterance.onend = () => {
        setIsSpeaking((prev) => ({ ...prev, [messageId]: false }));
      };

      utterance.onerror = () => {
        setIsSpeaking((prev) => ({ ...prev, [messageId]: false }));
        console.error("Speech synthesis error");
      };

      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Text-to-speech not supported in this browser");
    }
  };

  console.log("messages", messages);

  return (
    <div className="chat-content">
      {/* Resume Filter Pills - updated with collapsible feature */}
      {chatProps &&
        chatProps.resumeResults &&
        chatProps.resumeResults.length > 0 && (
          <div
            className={`chat-resume-pills-container ${
              pillsCollapsed ? "collapsed" : ""
            }`}
          >
            <div className="chat-resume-pills-header">
              <div className="pills-summary">
                {chatProps.selectedResumeIds.length > 0 ? (
                  <span className="pills-selected-count">
                    {chatProps.selectedResumeIds.length}{" "}
                    {chatProps.selectedResumeIds.length === 1
                      ? "resume"
                      : "resumes"}{" "}
                    selected
                  </span>
                ) : (
                  <span className="pills-selected-all">All resumes</span>
                )}
              </div>
              <ToggleButton
                isCollapsed={pillsCollapsed}
                onClick={togglePillsCollapsed}
              />
            </div>

            <div className="chat-resume-pills-wrapper">
              <div className="chat-resume-pills-scroll">
                <button
                  className={`chat-resume-pill ${
                    !chatProps.selectedResumeIds.length ? "active" : ""
                  }`}
                  onClick={() => chatProps.onResumeSelect(null)}
                >
                  All
                </button>

                {chatProps.resumeResults
                  .sort((a, b) => (a.rank || 999) - (b.rank || 999))
                  .map((resume) => (
                    <button
                      key={resume.resumeId}
                      className={`chat-resume-pill ${
                        chatProps.selectedResumeIds.includes(resume.resumeId)
                          ? "active"
                          : ""
                      }`}
                      onClick={() => chatProps.onResumeSelect(resume?.resumeId)}
                    >
                      {resume.rank && (
                        <span className="chat-pill-rank">
                          {resume.resumeId}
                        </span>
                      )}
                      {" - "}
                      <span className="chat-pill-text">
                        {resume.candidateName}
                      </span>
                    </button>
                  ))}

                {chatProps.selectedResumeIds.length > 0 && (
                  <button
                    className="chat-resume-pill chat-clear-pill"
                    onClick={() => chatProps.onResumeSelect(null)}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      <div className="ai-chat-messages-container">
        {messages.length === 0 ? (
          <div className="assistant-welcome">
            <div className="assistant-welcome-icon">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C8.14 2 5 5.14 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.14 15.86 2 12 2ZM9 21C9 21.55 9.45 22 10 22H14C14.55 22 15 21.55 15 21V20H9V21ZM12 4C14.76 4 17 6.24 17 9C17 11.76 14.76 14 12 14C9.24 14 7 11.76 7 9C7 6.24 9.24 4 12 4ZM11 9.5H10V10.5H11V9.5ZM14 9.5H13V10.5H14V9.5Z" />
              </svg>
            </div>
            <h4>Hello! I'm your Resume AI Assistant</h4>
            <p>Ask me anything about your selected resumes</p>
          </div>
        ) : (
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-wrapper ${
                  message.sender === "user"
                    ? "ai-user-message-wrapper"
                    : "ai-bot-message-wrapper"
                }`}
              >
                <div className="message-container">
                  <div
                    className={`message ${
                      message?.sender === "user"
                        ? "ai-user-message"
                        : "ai-bot-message"
                    }`}
                  >
                    {message.loading ? (
                      <div className="loader-container">
                        <div className="animated-loader">
                          <div className="loader-dot primary"></div>
                          <div className="loader-dot secondary"></div>
                          <div className="loader-dot primary"></div>
                        </div>
                      </div>
                    ) : (
                      <p>{message.text}</p>
                    )}
                  </div>

                  {!message.loading && message.sender === "bot" && (
                    <div className="message-actions">
                      <button
                        className="chat-action-button copy-button"
                        onClick={() => copyToClipboard(message.text)}
                        title="Copy response"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                          <rect
                            x="8"
                            y="2"
                            width="8"
                            height="4"
                            rx="1"
                            ry="1"
                          ></rect>
                        </svg>
                        <span className="tooltip">Copy</span>
                      </button>

                      <button
                        className={`chat-action-button speaker-button ${
                          isSpeaking[message.id] ? "speaking" : ""
                        }`}
                        onClick={() =>
                          handleTextToSpeech(message.text, message.id)
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                          {!isSpeaking[message.id] ? (
                            <>
                              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                            </>
                          ) : (
                            <line x1="23" y1="9" x2="17" y2="15"></line>
                          )}
                        </svg>
                        <span className="tooltip">
                          {isSpeaking[message.id]
                            ? "Stop speaking"
                            : "Read aloud"}
                        </span>
                      </button>

                      <button
                        className="chat-action-button thumbs-up-button"
                        onClick={() => handleFeedback("good", message.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg>
                        <span className="tooltip">Good response</span>
                      </button>

                      <button
                        className="chat-action-button thumbs-down-button"
                        onClick={() => handleFeedback("bad", message.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H6a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"></path>
                          <path d="M17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path>
                        </svg>
                        <span className="tooltip">Bad response</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      <div className="chat-input-container">
        <textarea
          ref={inputRef}
          className="chat-input"
          placeholder="Type here..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />

        <button
          className={`mic-button ${isListening ? "listening" : ""}`}
          onClick={toggleListening}
          disabled={isLoading}
          title={isListening ? "Stop listening" : "Voice input"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        </button>

        <button
          className="send-button"
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ResumeChatWithAI;
