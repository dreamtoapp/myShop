import { ImageResponse } from 'next/og';
import { companyInfo } from './(e-comm)/actions/companyDetail';

// Icon metadata
export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

// Image generation
export default async function Icon() {
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
              borderRadius: '6px',
              overflow: 'hidden',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="Company Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: '2px',
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
    console.warn('Failed to fetch company logo for icon:', error);
  }

  // Fallback: Generate a default icon with company initials
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #2196f3, #1976d2)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '6px',
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
