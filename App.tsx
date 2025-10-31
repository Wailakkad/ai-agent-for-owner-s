
import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { ChatPanel } from './components/ChatPanel';
import { InfoPanel } from './components/InfoPanel';
import type { Message, ImageFile } from './types';
import { Sender } from './types';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      sender: Sender.AI,
      text: "Hello! I'm Zack, your friendly AI Agent here to help with Sheetify Toolkits. How can I assist you?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const [editingImage, setEditingImage] = useState<ImageFile | null>(null);

  useEffect(() => {
    const initChat = async () => {
      if (!chat) {
        const chatInstance = await geminiService.startChat();
        setChat(chatInstance);
      }
    };
    initChat();
  }, [chat]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { id: crypto.randomUUID(), sender: Sender.User, text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    if (editingImage) {
      await handleImageEditing(text, editingImage);
    } else {
      await handleChat(text);
    }
  };

  const handleImageEditing = async (prompt: string, imageFile: ImageFile) => {
    try {
      const editedImageBase64 = await geminiService.editImage(imageFile.base64, imageFile.file.type, prompt);
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        sender: Sender.AI,
        text: 'Here is the edited image:',
        imageUrl: `data:image/png;base64,${editedImageBase64}`,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Image editing failed:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        sender: Sender.System,
        text: 'Sorry, I was unable to edit the image.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setEditingImage(null);
    }
  };
  
  const handleChat = async (text: string) => {
     if (!chat) {
        const errorMessage: Message = { id: crypto.randomUUID(), sender: Sender.System, text: "Chat is not initialized." };
        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
        return;
    }

    try {
        const stream = await chat.sendMessageStream({ message: text });
        let aiResponseText = '';
        let messageId = crypto.randomUUID();
        let firstChunk = true;

        for await (const chunk of stream) {
            aiResponseText += chunk.text;
            if (firstChunk) {
                const aiMessage: Message = { id: messageId, sender: Sender.AI, text: aiResponseText, isTyping: true };
                setMessages(prev => [...prev, aiMessage]);
                firstChunk = false;
            } else {
                 setMessages(prev => prev.map(m => m.id === messageId ? {...m, text: aiResponseText} : m));
            }
        }
        setMessages(prev => prev.map(m => m.id === messageId ? {...m, isTyping: false} : m));

    } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage: Message = { id: crypto.randomUUID(), sender: Sender.System, text: "Sorry, something went wrong." };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };


  const handleImageUpload = (imageFile: ImageFile) => {
    setEditingImage(imageFile);
    const imageMessage: Message = {
      id: crypto.randomUUID(),
      sender: Sender.System,
      text: 'Image uploaded. What changes would you like to make?',
      imageUrl: imageFile.base64,
    };
    setMessages((prev) => [...prev, imageMessage]);
  };

  return (
    <div className="bg-gray-100 h-screen w-screen flex items-center justify-center font-sans">
      <main className="w-full max-w-6xl h-[90vh] bg-white rounded-2xl shadow-2xl flex overflow-hidden">
        <ChatPanel
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onImageUpload={handleImageUpload}
        />
        <InfoPanel />
      </main>
    </div>
  );
};

export default App;
