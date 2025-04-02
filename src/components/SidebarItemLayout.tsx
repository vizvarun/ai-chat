import React, { ReactNode } from "react";
import Breadcrumbs from "./Breadcrumbs";
import ChatWithMaggi from "./ChatWithMaggi"; // Ensure the path is correct
import "../styles/SidebarItemLayout.css";

interface SidebarItemLayoutProps {
  children: ReactNode;
  title?: string;
  showChatOption?: boolean;
  isScrollable?: boolean; // New prop to control content-area scrollable class
  showChat?: boolean; // Prop to control chat visibility
  onToggleChat?: () => void; // Callback for toggling chat visibility
}

const SidebarItemLayout: React.FC<SidebarItemLayoutProps> = ({
  children,
  title,
  showChatOption = true,
  isScrollable = false,
  showChat = false,
  onToggleChat,
}) => {
  return (
    <div className="tab-container">
      <Breadcrumbs />
      <div className={`content-area ${isScrollable ? "scrollable" : ""}`}>
        <div className="sidebar-item-main-content">{children}</div>

        {showChatOption && (
          <div className="sidebar-item-chat-section">
            <button className="toggle-chat-button" onClick={onToggleChat}>
              {showChat ? "Hide Assistant" : "Show Assistant"}
            </button>

            {showChat && (
              <div className="sidebar-chat-container">
                <ChatWithMaggi />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarItemLayout;
