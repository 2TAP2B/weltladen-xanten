import type { APIRoute } from 'astro';
import { submitKontaktForm } from '../../utils/directus';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Bitte füllen Sie alle erforderlichen Felder aus.'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Submit to Directus
    const submission = await submitKontaktForm({
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      subject: data.subject,
      message: data.message
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Vielen Dank für Ihre Nachricht! Wir werden uns bald bei Ihnen melden.',
        data: submission
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};
