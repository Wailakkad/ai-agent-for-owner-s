
import React, { useRef, useEffect } from 'react';
import type { Message, ImageFile } from '../types';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';

interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onImageUpload: (file: ImageFile) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, isLoading, onSendMessage, onImageUpload }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-grow flex flex-col bg-white w-full lg:w-2/3">
      <div className="flex-grow p-6 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && !messages[messages.length-1].isTyping && (
             <MessageBubble key="loading" message={{id: 'loading', sender: 1, isTyping: true}} />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <ChatInput onSendMessage={onSendMessage} onImageUpload={onImageUpload} isLoading={isLoading} />
    </div>
  );
};
