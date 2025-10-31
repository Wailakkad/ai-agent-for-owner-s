
import React from 'react';
import type { Message } from '../types';
import { Sender } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1">
    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
  </div>
);

const AIAvatar: React.FC = () => (
    <div className="w-8 h-8 rounded-full bg-sheetify-purple flex-shrink-0 mr-3 overflow-hidden">
        <img src="https://picsum.photos/seed/zack-avatar/40/40" alt="AI Avatar" className="w-full h-full object-cover" />
    </div>
);


export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { sender, text, imageUrl, isTyping } = message;

  if (sender === Sender.System) {
    return (
      <div className="flex flex-col items-center text-center text-gray-500 my-2">
        <p className="text-sm">{text}</p>
        {imageUrl && (
          <img src={imageUrl} alt="System content" className="mt-2 rounded-lg max-w-xs shadow-md" />
        )}
      </div>
    );
  }

  const isUser = sender === Sender.User;
  
  return (
    <div className={`flex items-start ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <AIAvatar />}
      <div className={`flex flex-col space-y-2 max-w-md ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 rounded-2xl ${isUser ? 'bg-sheetify-light-purple text-gray-800 rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
          {isTyping && !text ? <TypingIndicator /> : <p className="whitespace-pre-wrap">{text}</p>}
          {imageUrl && (
            <img src={imageUrl} alt="Chat content" className="mt-2 rounded-lg max-w-xs" />
          )}
        </div>
      </div>
    </div>
  );
};
