'use server';

import db from '@/lib/prisma';
import { generateSecurePassword } from './passwordUtils';

export async function sendPasswordViaWhatsApp(phoneNumber: string, userName: string) {
  try {
    console.log('📱 Starting WhatsApp password delivery for:', phoneNumber);

    // Generate a new secure password
    const newPassword = generateSecurePassword();

    // Update user's password in database
    const updatedUser = await db.user.update({
      where: { phone: phoneNumber },
      data: {
        password: newPassword,
        updatedAt: new Date()
      },
      select: {
        id: true,
        phone: true,
        name: true
      }
    });

    if (!updatedUser) {
      throw new Error('Failed to update user password');
    }

    // Prepare WhatsApp message
    const message = `مرحباً ${userName}! 👋

🔐 تم إعادة تعيين كلمة المرور الخاصة بك

📱 كلمة المرور الجديدة: ${newPassword}

⚠️ يرجى تغيير كلمة المرور بعد تسجيل الدخول لأول مرة

🔒 لأمان حسابك، لا تشارك هذه الرسالة مع أي شخص

شكراً لك! 🙏`;

    // TODO: Integrate with your existing WhatsApp API
    // This should use your current WhatsApp integration
    console.log('📤 WhatsApp message prepared:', message);

    // For now, simulate WhatsApp sending
    // Replace this with your actual WhatsApp API call
    await simulateWhatsAppSending(phoneNumber, message);

    console.log('✅ Password sent via WhatsApp successfully');

    return {
      success: true,
      message: 'تم إرسال كلمة المرور عبر الواتس اب بنجاح',
      password: newPassword, // Remove this in production
      user: updatedUser
    };

  } catch (error) {
    console.error('❌ Error sending password via WhatsApp:', error);

    return {
      success: false,
      message: 'فشل في إرسال كلمة المرور عبر الواتس اب',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Temporary simulation - replace with your actual WhatsApp API
async function simulateWhatsAppSending(phone: string, message: string) {
  console.log('📱 SIMULATING WhatsApp sending to:', phone);
  console.log('📝 Message:', message);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulate success
  return { success: true };
}
