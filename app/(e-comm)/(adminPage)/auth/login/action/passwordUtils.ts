// Password utility functions for forgot password functionality

/**
 * Generate a secure, user-friendly password
 * Format: 2 uppercase letters + 2 lowercase letters + 2 numbers + 2 special chars
 * Example: Ab12!@#$
 */
export function generateSecurePassword(): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*';

  let password = '';

  // Add 2 random uppercase letters
  for (let i = 0; i < 2; i++) {
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  }

  // Add 2 random lowercase letters
  for (let i = 0; i < 2; i++) {
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  }

  // Add 2 random numbers
  for (let i = 0; i < 2; i++) {
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  // Add 2 random special characters
  for (let i = 0; i < 2; i++) {
    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  }

  // Shuffle the password for better security
  return shuffleString(password);
}

/**
 * Shuffle a string to randomize character positions
 */
function shuffleString(str: string): string {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('يجب أن تحتوي على حرف كبير واحد على الأقل');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('يجب أن تحتوي على حرف صغير واحد على الأقل');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('يجب أن تحتوي على رقم واحد على الأقل');
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('يجب أن تحتوي على رمز خاص واحد على الأقل');
  }

  const isValid = score >= 4; // At least 4 out of 5 criteria met

  return {
    isValid,
    score,
    feedback
  };
}
