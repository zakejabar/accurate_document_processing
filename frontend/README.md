# n8n Document Processor

This project is a Next.js application that allows you to upload documents and process them using n8n workflows.

## Features

-   **File Upload:** Upload PDF, DOCX, TXT, or CSV files.
-   **n8n Integration:** The uploaded files are sent to an n8n workflow for processing.
-   **Market Intelligence Pipeline:** The n8n workflow processes the document (extracting text or parsing CSV) and uses Google Gemini to analyze market prices in Indonesia.
-   **Mock API:** The application includes a mock API that allows you to test the frontend without a live n8n instance.

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/your-repository.git
    ```

2.  **Install the dependencies:**

    ```bash
    cd frontend
    npm install
    ```

3.  **Set up the environment variables:**

    Create a `.env.local` file in the `frontend` directory and add the following environment variables:

    ```bash
    N8N_WEBHOOK_URL=
    ```

    You can find the webhook URL in your n8n workflow editor.

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:3000`.

## n8n Workflow

The n8n workflow is defined in the `n8n_workflow_fixed.json` file. You can import this file into your n8n instance to set up the workflow.

The workflow has the following nodes:

-   **Webhook (Upload)1:** Receives the uploaded file binary data.
-   **Extract from File:** Extracts text content from uploaded documents.
-   **Parse CSV File:** Parses uploaded CSV files (alternative path).
-   **HTTP Request (Gemini):** Sends a prompt to Google Gemini to ask about market prices in Indonesia for the extracted item.
-   **Respond to Webhook1:** Returns the AI analysis to the frontend.