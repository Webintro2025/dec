import Product from "@/components/Product";

export const metadata = {
  title: "All Products",
  description: "Browse all products",
};

export default function ProductsPage() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto  mt-17 px-4">
        <Product />
      </div>
    </main>
  );
}
