// Migration script to update existing company record
import db from '@/lib/prisma';

async function updateCompanyDefaults() {
  try {
    console.log('🔄 Updating company record with new platform settings defaults...');
    
    const result = await db.company.updateMany({
      where: {}, // Update all company records
      data: {
        showHeroImage: false,
        showStoreLocation: false,
        showCustomerCount: false,
        showProductCount: false,
        showVision2030: false,
        isTaxEnabled: false,
        emailNotifications: false,
        defaultCurrency: 'SAR',
      }
    });
    
    console.log('✅ Updated company records:', result);
    
    // Verify the update
    const company = await db.company.findFirst();
    console.log('🔍 Updated company record:');
    console.log('showHeroImage:', company?.showHeroImage);
    console.log('showStoreLocation:', company?.showStoreLocation);
    console.log('showCustomerCount:', company?.showCustomerCount);
    console.log('showProductCount:', company?.showProductCount);
    console.log('showVision2030:', company?.showVision2030);
    console.log('isTaxEnabled:', company?.isTaxEnabled);
    console.log('emailNotifications:', company?.emailNotifications);
    console.log('defaultCurrency:', company?.defaultCurrency);
    
  } catch (error) {
    console.error('❌ Error updating company:', error);
  } finally {
    await db.$disconnect();
  }
}

updateCompanyDefaults();





