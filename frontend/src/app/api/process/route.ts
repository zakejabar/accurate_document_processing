
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
      return NextResponse.json({
        message: "Mock success: n8n webhook URL not configured yet.",
        fileName: file.name,
        size: file.size,
        processed: true
      });
    }

    console.log(`Sending file to n8n: ${n8nWebhookUrl}`);

    // Convert file to ArrayBuffer then Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Send binary data to n8n
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'X-File-Name': file.name,
      },
      body: buffer,
    });

    console.log(`n8n response status: ${n8nResponse.status} ${n8nResponse.statusText}`);
    const contentType = n8nResponse.headers.get('content-type');
    console.log(`n8n response content-type: ${contentType}`);

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error(`n8n error body: ${errorText}`);
      return NextResponse.json({ error: `n8n Error: ${n8nResponse.status} ${errorText}` }, { status: n8nResponse.status });
    }

    // Try to parse JSON, otherwise return text
    let data;
    if (contentType && contentType.includes('application/json')) {
      const text = await n8nResponse.text(); // Read text first to debug if needed
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse n8n JSON:', text);
        throw new Error('Received invalid JSON from n8n');
      }
    } else {
      data = { message: await n8nResponse.text() };
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error processing file:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
