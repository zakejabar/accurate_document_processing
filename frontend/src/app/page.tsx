
import FileUpload from '../components/FileUpload';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 md:p-24 bg-zinc-50 dark:bg-black pt-24 md:pt-32 transition-colors duration-500">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-12">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-zinc-200 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-zinc-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-zinc-200 lg:p-4 lg:dark:bg-zinc-800/30 shadow-sm">
          n8n Document Processor&nbsp;
        </p>
      </div>

      <div className="relative w-full flex justify-center">
        <FileUpload />
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left mt-12">
        {/* Footer or extra info could go here */}
      </div>
    </main>
  );
}
