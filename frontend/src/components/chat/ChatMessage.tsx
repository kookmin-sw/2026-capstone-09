'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  shouldAnimate?: boolean;
}

// 타이핑 효과 전용 컴포넌트
function StreamingText({ content, shouldAnimate }: { content: string; shouldAnimate: boolean }) {
  const [displayedContent, setDisplayedContent] = useState(shouldAnimate ? '' : content);
  const [currentIndex, setCurrentIndex] = useState(shouldAnimate ? 0 : content.length);

  // 타이핑 애니메이션
  useEffect(() => {
    if (shouldAnimate && currentIndex < content.length) {
      const timeout = setTimeout(() => {
        const nextIndex = Math.min(currentIndex + 3, content.length);
        setDisplayedContent(content.slice(0, nextIndex));
        setCurrentIndex((prev) => Math.min(prev + 3, content.length));
      }, 20);

      return () => clearTimeout(timeout);
    }
  }, [content, currentIndex, shouldAnimate]);

  // 링크 보안 검증
  const isValidUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return ['http:', 'https:', 'mailto:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  return (
    <>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <span className="block">{children}</span>,
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          code: ({ className, children }) => {
            const isInline = !className;
            return isInline ? (
              <code className="px-1.5 py-0.5 rounded bg-fill-alternative text-label-strong font-mono text-sm">
                {children}
              </code>
            ) : (
              <code className={className}>{children}</code>
            );
          },
          pre: ({ children }) => (
            <pre className="p-3 rounded-lg bg-fill-alternative overflow-x-auto my-2">
              {children}
            </pre>
          ),
          ul: ({ children }) => <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="ml-2">{children}</li>,
          h1: ({ children }) => <h1 className="text-xl font-bold my-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold my-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-bold my-2">{children}</h3>,
          a: ({ href, children }) => {
            if (!isValidUrl(href)) {
              return <span className="text-label-alternative">{children}</span>;
            }
            return (
              <a href={href} className="text-primary-40 underline" target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-label-disable pl-3 my-2 text-label-alternative">
              {children}
            </blockquote>
          ),
        }}
      >
        {displayedContent}
      </ReactMarkdown>
    </>
  );
}

export function ChatMessage({ role, content, shouldAnimate = false }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {isUser ? (
        <div className="max-w-[80%]">
          <div className="px-4 py-2 rounded-2xl bg-fill-alternative text-label-normal rounded-tr-sm">
            <p className="text-body-2 whitespace-pre-wrap break-words">{content}</p>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="text-body-2 text-label-normal">
            <StreamingText key={content} content={content} shouldAnimate={shouldAnimate} />
          </div>
        </div>
      )}
    </div>
  );
}