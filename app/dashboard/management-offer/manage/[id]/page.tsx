import { notFound } from 'next/navigation';
import { Package, Settings } from 'lucide-react';
import { getOfferById, getAllProducts } from '../../actions';
import { AssignedProducts } from '../../components/AssignedProducts';
import { ProductSelector } from '../../components/ProductSelector';
import { OfferBannerUpload } from '../../components/OfferBannerUpload';

interface ManageOfferPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ManageOfferPage({ params }: ManageOfferPageProps) {
    // Await the params Promise
    const { id } = await params;

    // Fetch offer and products data in parallel
    const [offer, allProducts] = await Promise.all([
        getOfferById(id).catch(() => null),
        getAllProducts().catch(() => [])
    ]);

    if (!offer) {
        notFound();
    }

    // Get assigned product IDs for filtering
    const assignedProductIds = offer.productAssignments?.map(assignment => assignment.product.id) || [];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background p-4">
                <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-primary" />
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">إدارة منتجات العرض</h1>
                        <p className="text-sm text-muted-foreground">{offer.name}</p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-4 space-y-6">
                {/* Banner Upload */}
                <OfferBannerUpload
                    offerId={offer.id}
                    offerName={offer.name}
                    currentBannerUrl={offer.bannerImage}
                />

                {/* Offer Info */}
                <div className="bg-card border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Package className="h-5 w-5 text-primary" />
                            <div>
                                <h2 className="font-semibold text-foreground">{offer.name}</h2>
                                {offer.description && (
                                    <p className="text-sm text-muted-foreground">{offer.description}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="text-center">
                                <div className="font-semibold text-primary">{offer.productAssignments?.length || 0}</div>
                                <div className="text-xs text-muted-foreground">منتج</div>
                            </div>
                            {offer.hasDiscount && offer.discountPercentage && (
                                <div className="text-center">
                                    <div className="font-semibold text-emerald-600">{offer.discountPercentage}%</div>
                                    <div className="text-xs text-muted-foreground">خصم</div>
                                </div>
                            )}
                            <div className="text-center">
                                <div className={`font-semibold ${offer.isActive ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                                    {offer.isActive ? 'نشط' : 'غير نشط'}
                                </div>
                                <div className="text-xs text-muted-foreground">الحالة</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Products */}
                <AssignedProducts
                    offerId={offer.id}
                    offerName={offer.name}
                    assignedProducts={offer.productAssignments || []}
                    hasDiscount={offer.hasDiscount}
                    discountPercentage={offer.discountPercentage}
                />

                {/* Add Products */}
                <ProductSelector
                    offerId={offer.id}
                    offerName={offer.name}
                    availableProducts={allProducts}
                    assignedProductIds={assignedProductIds}
                />
            </main>
        </div>
    );
} 