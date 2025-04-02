// Message type for chat interactions
export interface MessageType {
  id: string;
  text: string;
  sender: "user" | "bot";
  loading?: boolean;
}

// Record type for tracking which messages are being spoken
export type SpeakingStateRecord = Record<string, boolean>;

// Add Web Speech API type declarations for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
