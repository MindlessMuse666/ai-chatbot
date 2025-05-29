import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@heroui/react';

interface MessageInputProps {
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
}

export const MessageInput = ({ onSend, disabled }: MessageInputProps) => {
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSend(content);
      setContent('');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="
            w-full min-h-[44px] max-h-[200px]
            px-3 py-2 rounded-lg
            border border-input bg-background
            resize-none overflow-hidden
            focus:outline-none focus:ring-2 focus:ring-primary
          "
          rows={1}
          disabled={disabled}
        />
      </div>

      <Button
        type="submit"
        size="icon"
        disabled={!content.trim() || isSending || disabled}
        className="h-[44px] w-[44px]"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
}; 