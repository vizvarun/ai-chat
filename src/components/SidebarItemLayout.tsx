import React, { ReactNode, useEffect, useState, useRef } from "react";
import { API_ENDPOINTS } from "../config/env";
import "../styles/SidebarItemLayout.css";
import Breadcrumbs from "./Breadcrumbs";
import ChatWithAI from "./ChatWithAI";

interface SidebarItemLayoutProps {
  children: ReactNode;
  title?: string;
  showChatOption?: boolean;
  isScrollable?: boolean;
  showChat?: boolean;
  onToggleChat?: () => void;
}

const SidebarItemLayout: React.FC<SidebarItemLayoutProps> = ({
  children,
  showChatOption = true,
  isScrollable = false,
  showChat = false,
  onToggleChat,
}) => {
  const [apiError, setApiError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [chatWidth, setChatWidth] = useState(320);
  const startXRef = useRef(0);
  const startWidthRef = useRef(320);

  const MIN_CHAT_WIDTH = 300;
  const MAX_CHAT_WIDTH = 600;

  // Reset isClosing state when showChat changes
  useEffect(() => {
    if (showChat) {
      setIsClosing(false);
    }
  }, [showChat]);

  // Handle closing the chat with no animation
  const handleCloseChat = () => {
    if (onToggleChat) {
      setIsClosing(true);
      onToggleChat();
    }
  };

  // Handle API errors
  const handleApiError = (error: any) => {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unknown error occurred";
    setApiError(errorMessage);
    console.error("Chat API error:", errorMessage);
  };

  // New handlers for the resizable chatbox
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    startXRef.current = e.clientX;
    startWidthRef.current = chatWidth;
    // Prevent text selection while resizing
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const newWidth = startWidthRef.current + (startXRef.current - e.clientX);
    setChatWidth(Math.min(Math.max(newWidth, MIN_CHAT_WIDTH), MAX_CHAT_WIDTH));
  };

  const handleMouseUp = (e: MouseEvent) => {
    document.body.style.userSelect = "";
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="tab-container">
      <Breadcrumbs />
      <div className={`layout-container ${showChat ? "with-assistant" : ""}`}>
        <div className={`content-area ${isScrollable ? "scrollable" : ""}`}>
          {showChatOption && !showChat && (
            <button
              className="assistant-toggle-btn"
              onClick={onToggleChat}
              aria-label="Show Assistant"
              title="Open AI Assistant"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C8.14 2 5 5.14 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.14 15.86 2 12 2ZM9 21C9 21.55 9.45 22 10 22H14C14.55 22 15 21.55 15 21V20H9V21ZM12 4C14.76 4 17 6.24 17 9C17 11.76 14.76 14 12 14C9.24 14 7 11.76 7 9C7 6.24 9.24 4 12 4ZM11 9.5H10V10.5H11V9.5ZM14 9.5H13V10.5H14V9.5Z" />
              </svg>
            </button>
          )}
          <div className="sidebar-item-main-content">{children}</div>
        </div>

        {showChatOption && (
          <div
            className={`assistant-panel ${isClosing ? "no-animation" : ""}`}
            style={{ width: showChat ? `${chatWidth}px` : "0" }}
          >
            <div
              className="resizer"
              onMouseDown={handleMouseDown}
              style={{
                width: "5px",
                cursor: "ew-resize",
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 2,
              }}
            />
            <div className="assistant-header">
              <div className="assistant-header-title">
                <svg
                  className="assistant-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C8.14 2 5 5.14 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.14 15.86 2 12 2Z" />
                  <path d="M9 21C9 21.55 9.45 22 10 22H14C14.55 22 15 21.55 15 21V20H9V21Z" />
                </svg>
                <h3>AI Assistant</h3>
              </div>
              <button
                className="assistant-close-btn"
                onClick={handleCloseChat}
                aria-label="Close Assistant"
                title="Close AI Assistant"
              >
                <svg
                  viewBox="0 0 16 16"
                  width="12"
                  height="12"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.41 8L12.7 4.71C13.09 4.32 13.09 3.69 12.7 3.3C12.31 2.91 11.68 2.91 11.29 3.3L8 6.59L4.71 3.3C4.32 2.91 3.69 2.91 3.3 3.3C2.91 3.69 2.91 4.32 3.3 4.71L6.59 8L3.3 11.29C2.91 11.68 2.91 12.31 3.3 12.7C3.69 13.09 4.32 13.09 4.71 12.7L8 9.41L11.29 12.7C11.68 13.09 12.31 13.09 12.7 12.7C13.09 12.31 13.09 11.68 12.7 11.29L9.41 8Z" />
                </svg>
              </button>
            </div>

            <div className="assistant-content">
              {apiError && (
                <div className="api-error-banner">
                  {apiError}
                  <button onClick={() => setApiError(null)}>Dismiss</button>
                </div>
              )}
              <div className="chat-with-ai-wrapper">
                <ChatWithAI
                  apiEndpoint={API_ENDPOINTS.CHAT_AI}
                  useQueryParam={true}
                  onError={handleApiError}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarItemLayout;
