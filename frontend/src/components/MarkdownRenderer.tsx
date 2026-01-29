import React from 'react';

interface MarkdownRendererProps {
    content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
    if (!content) return null;

    // Split lines and process them
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];

    // Helper to parse inline styles (bold)
    const parseInline = (text: string) => {
        // Split by bold markers
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <strong key={index} className="font-bold text-indigo-600 dark:text-indigo-400">
                        {part.slice(2, -2)}
                    </strong>
                );
            }
            return part;
        });
    };

    let currentList: React.ReactNode[] = [];

    lines.forEach((line, index) => {
        const trimmed = line.trim();

        // Headers (###)
        if (trimmed.startsWith('###')) {
            // Flush list if exists
            if (currentList.length > 0) {
                elements.push(
                    <ul key={`list-${index}`} className="my-4 space-y-2 pl-4">
                        {currentList}
                    </ul>
                );
                currentList = [];
            }

            const text = trimmed.replace(/^###\s*/, '');
            elements.push(
                <h3 key={`h3-${index}`} className="text-xl font-bold mt-6 mb-3 text-zinc-900 dark:text-zinc-100 flex items-center">
                    <span className="w-2 h-8 bg-indigo-500 rounded-full mr-3 inline-block"></span>
                    {text}
                </h3>
            );
        }
        // Headers (##) - unlikely based on input but good to have
        else if (trimmed.startsWith('##')) {
            if (currentList.length > 0) {
                elements.push(<ul key={`list-${index}`} className="my-4 space-y-2 pl-4">{currentList}</ul>);
                currentList = [];
            }
            const text = trimmed.replace(/^##\s*/, '');
            elements.push(
                <h2 key={`h2-${index}`} className="text-2xl font-bold mt-8 mb-4 border-b border-zinc-200 dark:border-zinc-700 pb-2 text-zinc-900 dark:text-zinc-100">
                    {text}
                </h2>
            );
        }
        // List items (* or -)
        else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            const text = trimmed.replace(/^[*|-]\s*/, '');
            currentList.push(
                <li key={`li-${index}`} className="text-zinc-700 dark:text-zinc-300 flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 mr-2 shrink-0"></span>
                    <span>{parseInline(text)}</span>
                </li>
            );
        }
        // Empty lines (separators)
        else if (trimmed === '') {
            if (currentList.length > 0) {
                elements.push(<ul key={`list-${index}`} className="my-4 space-y-2 pl-4">{currentList}</ul>);
                currentList = [];
            }
            // Optional: Visual separator ? 
            // elements.push(<div key={`spacer-${index}`} className="h-2" />);
        }
        // Regular paragraphs
        else {
            if (currentList.length > 0) {
                elements.push(<ul key={`list-${index}`} className="my-4 space-y-2 pl-4">{currentList}</ul>);
                currentList = [];
            }

            // Check if it's a "---" separator
            if (trimmed === '---') {
                elements.push(<hr key={`hr-${index}`} className="my-6 border-zinc-200 dark:border-zinc-700" />);
            } else {
                elements.push(
                    <p key={`p-${index}`} className="mb-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {parseInline(trimmed)}
                    </p>
                );
            }
        }
    });

    // Flush remaining list
    if (currentList.length > 0) {
        elements.push(
            <ul key={`list-end`} className="my-4 space-y-2 pl-4">
                {currentList}
            </ul>
        );
    }

    return (
        <div className="font-sans">
            {elements}
        </div>
    );
}
