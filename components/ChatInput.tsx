
import React, { useState, useRef } from 'react';
import type { ImageFile } from '../types';
import { SparklesIcon, SendIcon, ImageIcon } from './icons';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onImageUpload: (file: ImageFile) => void;
  isLoading: boolean;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]); // Remove the data URI prefix
        };
        reader.onerror = (error) => reject(error);
    });
};

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onImageUpload, isLoading }) => {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };
  
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        try {
            const base64 = await fileToBase64(file);
            onImageUpload({ file, base64 });
        } catch (error) {
            console.error("Error converting file to base64", error);
        }
    }
  };

  const handleImageIconClick = () => {
      fileInputRef.current?.click();
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-gray-100 rounded-xl p-2">
          <button type="button" className="p-2 text-gray-500 hover:text-sheetify-purple">
            <SparklesIcon />
          </button>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type here"
            className="w-full bg-transparent focus:outline-none px-2 text-gray-700"
            disabled={isLoading}
          />
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleImageFileChange}
            className="hidden"
            accept="image/*"
          />
          <button type="button" onClick={handleImageIconClick} className="p-2 text-gray-500 hover:text-sheetify-purple">
             <ImageIcon />
          </button>
          <button type="submit" disabled={isLoading || !text.trim()} className="p-2 text-white bg-sheetify-purple rounded-full disabled:bg-gray-300 transition-colors">
            <SendIcon />
          </button>
        </div>
      </form>
    </div>
  );
};
