
'use client';

import { useState, useCallback } from 'react';

export default function FileUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [response, setResponse] = useState<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setResponse(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setStatus('uploading');
        setResponse(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/process', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error(`Error: ${res.statusText}`);
            }

            const data = await res.json();
            setResponse(data);
            setStatus('success');
        } catch (error: any) {
            console.error('Upload failed:', error);
            setStatus('error');
            setResponse({ error: error.message || 'An unknown error occurred' });
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">Upload Document</h2>

            <div className="flex flex-col gap-4">
                <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg cursor-pointer bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-zinc-500 dark:text-zinc-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">PDF, DOCX, TXT (MAX. 10MB)</p>
                    </div>
                    <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                </label>

                {file && (
                    <div className="text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 p-2 rounded flex items-center justify-between">
                        <span className="truncate max-w-[80%]">{file.name}</span>
                        <span className="text-xs text-zinc-500">{(file.size / 1024).toFixed(1)} KB</span>
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={!file || status === 'uploading'}
                    className={`w-full py-2 px-4 rounded-lg font-medium text-white transition-colors ${!file || status === 'uploading'
                            ? 'bg-zinc-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {status === 'uploading' ? 'Processing...' : 'Process Document'}
                </button>

                {status === 'success' && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300">
                        <h3 className="font-semibold mb-2">Result:</h3>
                        <pre className="text-xs overflow-auto whitespace-pre-wrap max-h-40">
                            {JSON.stringify(response, null, 2)}
                        </pre>
                    </div>
                )}

                {status === 'error' && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                        <h3 className="font-semibold mb-2">Error:</h3>
                        <pre className="text-xs overflow-auto whitespace-pre-wrap max-h-40">
                            {JSON.stringify(response, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
