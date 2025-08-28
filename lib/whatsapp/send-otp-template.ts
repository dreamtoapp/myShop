'use server';

import { getWhatsAppConfig, buildApiEndpoint, getApiHeaders } from '@/lib/whatsapp/config';
import { convertToInternationalFormat } from '@/lib/whatsapp/whatsapp';

export interface TemplateMessageResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

// Send OTP using WhatsApp approved template
export async function sendOTPTemplate(
  phoneNumber: string,
  otp: string
): Promise<TemplateMessageResponse> {
  try {
    const { accessToken, phoneNumberId } = await getWhatsAppConfig();
    if (!accessToken || !phoneNumberId) return { success: false, error: 'Server configuration error' };

    // Force KSA MSISDN formatting (966) if number starts with local 05xx
    let internationalPhone = convertToInternationalFormat(phoneNumber);
    if (/^0?5\d{8}$/.test(phoneNumber)) {
      // e.g., 05xxxxxxxx or 5xxxxxxxx → 9665xxxxxxxx
      const local = phoneNumber.replace(/^0/, '');
      internationalPhone = `966${local}`;
    }
    const endpoint = await buildApiEndpoint('/messages');
    const headers = await getApiHeaders();

    async function sendWithLanguage(lang: string) {
      const body = {
        messaging_product: 'whatsapp',
        to: internationalPhone,
        type: 'template',
        template: {
          name: 'confirm',
          language: { code: lang },
          components: [
            {
              type: 'body',
              parameters: [{ type: 'text', text: otp }],
            },
          ],
        },
      } as const;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      const json = await res.json();
      return { ok: res.ok, json } as const;
    }

    // Try KSA locale first; if missing translation (132001), fallback to generic Arabic
    const first = await sendWithLanguage('ar_SA');
    if (first.ok) return { success: true, data: first.json };

    const errMsg = first.json?.error?.message as string | undefined;
    if (errMsg && (errMsg.includes('132001') || errMsg.toLowerCase().includes('translation'))) {
      const second = await sendWithLanguage('ar');
      return second.ok
        ? { success: true, data: second.json }
        : { success: false, error: second.json?.error?.message || 'Failed to send template' };
    }

    return { success: false, error: errMsg || 'Failed to send template' };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
}





