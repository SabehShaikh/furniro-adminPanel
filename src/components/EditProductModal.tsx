"use client";

import { useState , useEffect} from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { client } from '@/sanity/lib/client';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

type EditProductModalProps = {
    product: Product | null;  // Make product nullable
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedProduct: Product) => void;
  };

  export default function EditProductModal({ product, isOpen, onClose, onSave }: EditProductModalProps) {
    
    const [formData, setFormData] = useState<Product | null>(product);
    const [isSaving, setIsSaving] = useState(false);

   // Update formData when product changes
   useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        title: product.title || '',
        price: product.price || 0,
        originalPrice: product.originalPrice || 0,
        discountPercentage: product.discountPercentage || 0,
        quantity: product.quantity || 0,
        description: product.description || '',
        tags: product.tags || [],
      });
    }
  }, [product]);

    // Don't render the modal if there's no product or formData
    if (!product || !formData) {
        return null;
      }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setIsSaving(true);
  
    // Prepare an object to hold only the updated fields
    const updatedFields: Partial<Product> = {};
  
    // Compare and collect only the changed fields
    if (formData.title !== product.title) updatedFields.title = formData.title;
    if (formData.price !== product.price) updatedFields.price = formData.price;
    if (formData.originalPrice !== product.originalPrice) updatedFields.originalPrice = formData.originalPrice;
    if (formData.discountPercentage !== product.discountPercentage) updatedFields.discountPercentage = formData.discountPercentage;
    if (formData.quantity !== product.quantity) updatedFields.quantity = formData.quantity;
    if (formData.description !== product.description) updatedFields.description = formData.description;
    if (JSON.stringify(formData.tags) !== JSON.stringify(product.tags)) updatedFields.tags = formData.tags;
    if (formData.isNew !== product.isNew) updatedFields.isNew = formData.isNew;
  
    // If product image is unchanged, don't modify it.
    if (formData.productImage && formData.productImage !== product.productImage) {
      updatedFields.productImage = formData.productImage;
    }
  
    try {
      // Update only the modified fields in Sanity
      if (Object.keys(updatedFields).length > 0) {
        await client.patch(product._id).set(updatedFields).commit();
        toast.success("Product updated successfully!", {
          position: "bottom-right",
          autoClose: 3000,
        });
      } else {
        toast.info("No changes detected.");
      }
    } catch (err) {
      console.error("Failed to update product:", err);
      toast.error("Failed to update product. Please try again.");
    } finally {
      setIsSaving(false);
      onSave(formData); // Pass the formData back to the parent component
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Price</Label>
            <Input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Original Price</Label>
            <Input
              name="originalPrice"
              type="number"
              value={formData.originalPrice}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Discount Percentage</Label>
            <Input
              name="discountPercentage"
              type="number"
              value={formData.discountPercentage}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Quantity</Label>
            <Input
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
            />
          </div>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
        {/* Toast Container for Notifications */}
        <ToastContainer />
    </Dialog>
    
  );
}