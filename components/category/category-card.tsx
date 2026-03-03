import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Category {
  id: string | number;
  name: string;
  slug: string;
  imageurl: string;
  description: string;
}

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
        <CardHeader>
          <CardTitle>{category.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row items-center justify-center">
          <p className="text-sm text-muted-foreground">
            {category.description}
          </p>
          <div className="relative p-4 transition-transform group-hover:scale-[1.02]">
            {/* Fallback image menggunakan warna jika gambar asli tidak ada */}
            <img
              src={category.imageurl}
              className="object-contain w-20 h-20 mix-blend-multiply"
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
