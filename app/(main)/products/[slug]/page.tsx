import { Suspense } from "react";
import { ProductDetail } from "@/components/product/product-detail";
import { ProductDetailSkeleton } from "@/components/product/product-detail-skeleton";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  // Await params di Next.js versi terbaru (Next 14+)
  const { slug } = await params;

  return (
    <main className="min-h-screen container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Membungkus detail dengan Suspense agar Skeleton muncul */}
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail slug={slug} />
      </Suspense>
    </main>
  );
}
