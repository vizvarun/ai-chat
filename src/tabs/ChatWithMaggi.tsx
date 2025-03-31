import { useState, useRef, useEffect } from "react";
import "../styles/Tabs.css";
import "../styles/ChatWithMaggi.css";
import { MessageType, SpeakingStateRecord } from "../types/chatTypes";

// Define a type for SpeechRecognition event
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

const ChatWithMaggi = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<SpeakingStateRecord>({});
  const [isListening, setIsListening] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null); // Use any temporarily

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Initialize and clean up speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition: any = 
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      // Configure speech recognition
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      // Handle the results of speech recognition
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(Object.values(event.results))
          .map((result) => result[0]?.transcript || "")
          .join("");

        setInputMessage(transcript);
      };

      // Handle end of speech
      recognition.onend = () => {
        setIsListening(false);
      };

      // Handle errors
      recognition.onerror = (event: { error?: string }) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }

    // Clean up
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Focus the input field after getting a response
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      inputRef.current?.focus();
    }
  }, [isLoading, messages.length]);

  // Toggle speech recognition
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

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessageId = `msg-${Date.now()}-user`;
    const newUserMessage: MessageType = {
      id: userMessageId,
      text: inputMessage,
      sender: "user",
    };

    // Add temporary bot message with loading state
    const botMessageId = `msg-${Date.now()}-bot`;
    const loadingBotMessage: MessageType = {
      id: botMessageId,
      text: "", // Empty text since we'll use the animated loader
      sender: "bot",
      loading: true,
    };

    setMessages((prev) => [...prev, newUserMessage, loadingBotMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Mock API call with timeout
    setTimeout(() => {
      // Replace loading message with actual response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                id: botMessageId,
                text:
                  "Here's a response to your question about " +
                  inputMessage +
                  ". I can provide more details if needed. This is a simulated response that would typically come from an API call to a real backend service.",
                sender: "bot",
                loading: false,
              }
            : msg
        )
      );
      setIsLoading(false);

      // Textarea will get focus automatically thanks to the useEffect above
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Show temporary notification (you could add a toast notification here)
        console.log("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleFeedback = (type: "good" | "bad", messageId: string) => {
    // This would send feedback to the server in a real implementation
    console.log(`User gave ${type} feedback for message ${messageId}`);
    // You could implement visual feedback here (like changing the button color)
  };

  const handleTextToSpeech = (text: string, messageId: string) => {
    if ("speechSynthesis" in window) {
      // If already speaking this message, stop it
      if (isSpeaking[messageId]) {
        window.speechSynthesis.cancel();
        setIsSpeaking((prev) => ({ ...prev, [messageId]: false }));
        return;
      }

      // Cancel any other ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";

      // Set as speaking
      setIsSpeaking((prev) => ({ ...prev, [messageId]: true }));

      // When speech ends
      utterance.onend = () => {
        setIsSpeaking((prev) => ({ ...prev, [messageId]: false }));
      };

      // If there's an error
      utterance.onerror = () => {
        setIsSpeaking((prev) => ({ ...prev, [messageId]: false }));
        console.error("Speech synthesis error");
      };

      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Text-to-speech not supported in this browser");
    }
  };

  return (
    <div className="tab-container chat-container">
      <div className="content-area chat-content">
        <div className="chat-messages-container">
          {messages.length === 0 ? (
            <div className="empty-chat-state">
              <div className="empty-chat-prompt">
                <h3>What can I help you with?</h3>
                <p>Ask me anything about your test cases or requirements</p>
              </div>
            </div>
          ) : (
            <div className="chat-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message-wrapper ${
                    message.sender === "user"
                      ? "user-message-wrapper"
                      : "bot-message-wrapper"
                  }`}
                >
                  <div className="message-container">
                    <div
                      className={`message ${
                        message.sender === "user"
                          ? "user-message"
                          : "bot-message"
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
                          className="action-button copy-button"
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
                          className={`action-button speaker-button ${
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
                          className="action-button thumbs-up-button"
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
                          className="action-button thumbs-down-button"
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
            placeholder="Type your message here..."
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
    </div>
  );
};

// Fix the global declaration for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default ChatWithMaggi;
