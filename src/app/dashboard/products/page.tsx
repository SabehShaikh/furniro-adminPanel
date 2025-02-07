"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash } from "lucide-react";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Pagination";
import { useState, useEffect } from "react";
import EditProductModal from "@/components/EditProductModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { urlFor } from "@/sanity/lib/image";
import { Badge } from "@/components/ui/badge";

type Product = {
  _id: string;
  title: string;
  productImage: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  isNew: boolean;
  tags: string[];
  description?: string;
  quantity: number;
};

// Product Card Component for Mobile View
const ProductCard = ({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}) => (
  <Card className="h-full">
    <CardContent className="p-4">
      <div className="flex flex-col space-y-4">
        <div className="relative w-full aspect-square">
          {product.productImage ? (
            <Image
              src={urlFor(product.productImage).url()}
              alt={product.title}
              fill
              className="rounded-md object-cover"
              loading="lazy"
            />
          ) : (
            <Image
              src="/images/fallbackImg.jpg"
              alt="Fallback Image"
              fill
              className="rounded-md object-cover"
              loading="lazy"
            />
          )}
        </div>
        <div className="space-y-2">
          <h3 className="font-medium text-base">{product.title}</h3>
          <div className="text-sm text-gray-500">{product.tags.join(", ")}</div>
          <div className="text-base font-semibold">${product.price}</div>
          <div className="text-sm text-gray-600">In stock</div>
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(product)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data: Product[] = await client.fetch(`
          *[_type == "product"] {
            _id,
            title,
            "productImage": productImage.asset->url,
            price,
            originalPrice,
            discountPercentage,
            isNew,
            tags,
            description,
            quantity
          }
        `);
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch products");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCloseDelete = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedProduct: Product) => {
    try {
      await client.patch(updatedProduct._id).set(updatedProduct).commit();

      const data: Product[] = await client.fetch(`
        *[_type == "product"] {
          _id,
          title,
          "productImage": productImage.asset->url,
          price,
          originalPrice,
          discountPercentage,
          isNew,
          tags,
          description,
          quantity
        }
      `);
      setProducts(data);

      toast.success("Product updated successfully!");
    } catch (err) {
      console.error("Failed to update product:", err);
      toast.error("Failed to update product. Please try again.");
    } finally {
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await client.delete(productToDelete._id);

      // Filter out the deleted product from the state
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productToDelete._id)
      );

      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error("Failed to delete product:", err);
      toast.error("Failed to delete product. Please try again.");
    } finally {
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 px-4 py-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Badge variant="secondary" className="text-sm">
          {products.length} total
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {product.productImage ? (
                            <Image
                              src={urlFor(product.productImage).url()}
                              alt={product.title}
                              width={40}
                              height={40}
                              className="rounded-md"
                              loading="lazy"
                            />
                          ) : (
                            <Image
                              src="/images/fallbackImg.jpg"
                              alt="Fallback Image"
                              width={40}
                              height={40}
                              className="rounded-md"
                              loading="lazy"
                            />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.tags.join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${product.price}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">In stock</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(product)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Grid View */}
          <div className="grid md:hidden grid-cols-1 sm:grid-cols-2 gap-4">
            {currentProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>

          <div className="mt-6">
            <Pagination
              totalItems={products.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </CardContent>
      </Card>

      {selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          isOpen={isEditModalOpen}
          onClose={handleCloseEdit}
          onSave={handleSave}
        />
      )}

      {productToDelete && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDelete}
          onConfirm={handleDeleteConfirm}
        />
      )}

      <ToastContainer />
    </div>
  );
}
