import { ImageResponse } from 'next/og';
import { companyInfo } from './(e-comm)/actions/companyDetail';

// Apple icon metadata (180x180 is recommended for iOS)
export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

// Apple touch icon generation
export default async function AppleIcon() {
  try {
    // Try to get company logo from database
    const company = await companyInfo();
    const logoUrl = company?.logo || company?.profilePicture;

    if (logoUrl && logoUrl.trim() !== '') {
      // Use company logo if available
      return new ImageResponse(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white',
              borderRadius: '22px',
              overflow: 'hidden',
              padding: '20px',
            }}
          >
            <img
              src={logoUrl}
              alt="Company Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
        ),
        {
          ...size,
        }
      );
    }
  } catch (error) {
    // Fallback to default icon if logo fetch fails
    console.warn('Failed to fetch company logo for apple icon:', error);
  }

  // Fallback: Generate a default Apple touch icon
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 72,
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #2196f3, #1976d2)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '22px',
          textTransform: 'uppercase',
        }}
      >
        DTA
      </div>
    ),
    {
      ...size,
    }
  );
}
