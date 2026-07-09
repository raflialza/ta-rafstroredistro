"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Package, Trash2, Plus, Pencil, X } from "lucide-react";

type Product = {
  id: string;

  brand: string;

  name: string;

  slug: string;

  price: number;

  image_url: string;

  created_at: string;
};

export function ProductsTable({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState(initialProducts);

  const [isAdding, setIsAdding] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    brand: "Vans",

    name: "",

    price: "",

    image_url: "",
  });

  const [sizesData, setSizesData] = useState<{ size: number; stock: number }[]>(
    [
      { size: 38, stock: 0 },

      { size: 39, stock: 0 },

      { size: 40, stock: 0 },

      { size: 41, stock: 0 },
    ],
  );

  const supabase = createClient();

  const router = useRouter();

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",

      currency: "IDR",

      minimumFractionDigits: 0,
    }).format(price);
  };

  const startEdit = (product: Product) => {
    setFormData({
      brand: product.brand,

      name: product.name,

      price: product.price.toString(),

      image_url: product.image_url,
    });

    setEditingId(product.id);

    setImageFile(null);

    setIsAdding(true);
  };

  const cancelForm = () => {
    setIsAdding(false);

    setEditingId(null);

    setImageFile(null);

    setFormData({ brand: "Vans", name: "", price: "", image_url: "" });
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus sepatu "${name}"?`)) return;

    setIsLoading(true);

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (!error) {
      setProducts(products.filter((p) => p.id !== id));

      router.refresh();
    } else {
      alert("Gagal menghapus! Produk ini mungkin memiliki relasi data.");
    }

    setIsLoading(false);
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      let finalImageUrl = formData.image_url;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();

        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage

          .from("products")

          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage

          .from("products")

          .getPublicUrl(fileName);

        finalImageUrl = publicUrlData.publicUrl;
      }

      const generatedSlug = formData.name

        .toLowerCase()

        .replace(/\s+/g, "-")

        .replace(/[^a-z0-9-]/g, "");

      if (editingId) {
        const { error } = await supabase

          .from("products")

          .update({
            brand: formData.brand,

            name: formData.name,

            slug: generatedSlug,

            price: Number(formData.price),

            image_url: finalImageUrl,
          })

          .eq("id", editingId);

        if (error) throw error;

        setProducts(
          products.map((p) =>
            p.id === editingId
              ? {
                  ...p,

                  ...formData,

                  price: Number(formData.price),

                  image_url: finalImageUrl,
                }
              : p,
          ),
        );
      } else {
        const { data, error } = await supabase

          .from("products")

          .insert([
            {
              brand: formData.brand,

              name: formData.name,

              slug: generatedSlug,

              price: Number(formData.price),

              image_url: finalImageUrl,
            },
          ])

          .select();

        if (error) throw error;

        if (data) {
          const sizesToInsert = sizesData

            .filter((s) => s.stock > 0)

            .map((s) => ({
              product_id: data[0].id,

              size: s.size,

              stock: s.stock,
            }));

          if (sizesToInsert.length > 0)
            await supabase.from("product_sizes").insert(sizesToInsert);

          setProducts([data[0], ...products]);
        }
      }

      cancelForm();

      router.refresh();
    } catch (error: any) {
      alert("Terjadi kesalahan: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Package className="w-5 h-5" /> Katalog Saat Ini ({products.length})
        </h2>

        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-black text-white"
          >
            <Plus className="w-4 h-4 mr-2" /> Tambah Produk
          </Button>
        )}
      </div>

      {isAdding && (
        <form
          onSubmit={saveProduct}
          className="p-6 bg-zinc-50 border-2 rounded-xl space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-black uppercase text-sm">
              {editingId ? "Edit Sepatu" : "Detail Sepatu Baru"}
            </h3>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={cancelForm}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Merek</Label>

              <Input
                required
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Nama Sepatu</Label>

              <Input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Harga</Label>

              <Input
                required
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Gambar</Label>

              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <div className="space-y-2 border-t pt-4">
            <Label>Atur Stok per Ukuran</Label>

            <div className="grid grid-cols-4 gap-2">
              {sizesData.map((item, index) => (
                <div key={item.size}>
                  <Label className="text-[10px]">Ukuran {item.size}</Label>

                  <Input
                    type="number"
                    className="h-8"
                    value={item.stock}
                    onChange={(e) => {
                      const newSizes = [...sizesData];

                      newSizes[index].stock = parseInt(e.target.value) || 0;

                      setSizesData(newSizes);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white w-full md:w-auto"
          >
            {isLoading ? "Menyimpan..." : "Simpan Produk"}
          </Button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-100 uppercase text-xs font-bold border-b">
            <tr>
              <th className="px-6 py-4">Gambar</th>

              <th className="px-6 py-4">Nama</th>

              <th className="px-6 py-4">Merek</th>

              <th className="px-6 py-4">Harga</th>

              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y bg-white">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-3">
                  <img
                    src={product.image_url}
                    className="w-16 h-16 object-cover rounded border"
                  />
                </td>

                <td className="px-6 py-4 font-bold">{product.name}</td>

                <td className="px-6 py-4 text-muted-foreground">
                  {product.brand}
                </td>

                <td className="px-6 py-4 font-black">
                  {formatIDR(product.price)}
                </td>

                <td className="px-6 py-4 text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(product)}
                    className="text-blue-600"
                  >
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteProduct(product.id, product.name)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Hapus
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
