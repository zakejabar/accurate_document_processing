
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
        console.error('N8N_WEBHOOK_URL is not defined');
        // For development/demo purposes, return a mock response if no URL is set
        // return NextResponse.json({ error: 'N8N_WEBHOOK_URL is not configured.' }, { status: 500 });
        
        // Mock success for now to allow UI testing without actual n8n
         return NextResponse.json({ 
            message: "Mock success: n8n webhook URL not configured yet.",
            fileName: file.name,
            size: file.size,
            processed: true
        });
    }

    // Forward the form data to n8n
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      body: formData, // passing the FormData directly
    });

    if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text();
        return NextResponse.json({ error: `n8n Error: ${n8nResponse.status} ${errorText}` }, { status: n8nResponse.status });
    }

    // Try to parse JSON, otherwise return text
    const contentType = n8nResponse.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
        data = await n8nResponse.json();
    } else {
        data = { message: await n8nResponse.text() };
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error processing file:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
