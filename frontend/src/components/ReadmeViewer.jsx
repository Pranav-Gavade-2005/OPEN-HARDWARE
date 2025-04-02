import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ReadmeViewer({ content }) {
  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          img({ node, ...props }) {
            return (
              <img
                className="rounded-lg shadow-md max-w-full h-auto"
                alt={props.alt || 'Image'}
                {...props}
              />
            );
          },
          h1({ node, ...props }) {
            return (
              <h1 className="text-3xl font-bold text-gray-900 mb-4" {...props} />
            );
          },
          h2({ node, ...props }) {
            return (
              <h2 className="text-2xl font-bold text-gray-900 mb-3" {...props} />
            );
          },
          h3({ node, ...props }) {
            return (
              <h3 className="text-xl font-bold text-gray-900 mb-2" {...props} />
            );
          },
          p({ node, ...props }) {
            return (
              <p className="text-gray-600 mb-4 leading-relaxed" {...props} />
            );
          },
          ul({ node, ...props }) {
            return (
              <ul className="list-disc list-inside text-gray-600 mb-4" {...props} />
            );
          },
          ol({ node, ...props }) {
            return (
              <ol className="list-decimal list-inside text-gray-600 mb-4" {...props} />
            );
          },
          li({ node, ...props }) {
            return (
              <li className="mb-1" {...props} />
            );
          },
          blockquote({ node, ...props }) {
            return (
              <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4" {...props} />
            );
          },
          a({ node, ...props }) {
            return (
              <a className="text-blue-600 hover:text-blue-800 underline" {...props} />
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default ReadmeViewer; 