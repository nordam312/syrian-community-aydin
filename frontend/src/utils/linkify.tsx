import React from 'react';

interface LinkifyProps {
  text: string;
  className?: string;
}

export const Linkify: React.FC<LinkifyProps> = ({ text, className = '' }) => {
  // Regular expression لتحديد الروابط
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}[^\s]*)/gi;

  const parts = text.split(urlRegex);

  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;

        // التحقق من أن الجزء هو رابط
        if (part.match(urlRegex)) {
          let href = part;

          // إضافة http:// إذا لم يكن موجوداً
          if (!href.startsWith('http://') && !href.startsWith('https://')) {
            if (href.startsWith('www.')) {
              href = 'https://' + href;
            } else {
              href = 'https://' + href;
            }
          }

          return (
            <a
              key={index}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-syria-green-600 hover:text-syria-green-700 underline ${className}`}
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </a>
          );
        }

        // إرجاع النص العادي
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};