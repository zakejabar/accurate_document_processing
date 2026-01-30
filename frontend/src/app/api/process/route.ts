import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const prompt = formData.get('prompt') as string || 'Analyze this document';

    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      console.warn('N8N_WEBHOOK_URL is not defined, returning mock data.');
      // Simulate a realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return NextResponse.json({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: `## Mock Output for Prompt: "${prompt}"\n\nThis is a *mocked response* for the file **${file.name}**.\n\n### Analysis based on your prompt:\nSince the backend is in mock mode, I cannot perform the actual "${prompt}" action, but this confirms the text was successfully sent to the API.\n\n### File Details:\n- **Name:** ${file.name}\n- **Size:** ${(file.size / 1024).toFixed(2)} KB\n- **Type:** ${file.type}\n\nTo see real results, configure the \`N8N_WEBHOOK_URL\`.`
                }
              ]
            }
          }
        ]
      });
    }

    console.log(`Sending file to n8n: ${n8nWebhookUrl} with prompt: ${prompt}`);

    // Convert file to ArrayBuffer then Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Send binary data to n8n
    // Append the prompt as a query parameter so n8n can access it via $input.params.prompt or similar
    const urlWithParams = new URL(n8nWebhookUrl);
    urlWithParams.searchParams.append('prompt', prompt);

    const n8nResponse = await fetch(urlWithParams.toString(), {
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
