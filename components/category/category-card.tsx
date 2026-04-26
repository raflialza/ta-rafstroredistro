import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Category {
  id: string | number;
  name: string;
  slug: string;
  imageurl: string;
  description: string;
}

export function CategoryCard({ category }: { category: any }) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="h-full hover:bg-muted/50 transition-all cursor-pointer group">
        <CardHeader>
          <CardTitle className="uppercase italic font-black">
            {category.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row items-center justify-center">
          <p className="text-sm text-muted-foreground max-w-[150px]">
            {category.description}
          </p>
          <div className="relative p-4 transition-transform group-hover:scale-[1.02]">
            {/* Fallback image menggunakan warna jika gambar asli tidak ada */}
            <img
              src={category.imageurl}
              className="object-contain w-20 h-20 mix-blend-multiply"
              alt={category.name}
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
