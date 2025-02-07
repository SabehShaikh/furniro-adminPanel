"use client";
import React, { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Filter,
  Eye,
  Package2,
  DollarSign,
  ArrowUpDown,
  MapPin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/Pagination";
import { format } from "date-fns";

type CartItem = {
  title: string;
  quantity: number;
  price: number;
  productImage: string;
};

type Order = {
  _id: string;
  orderId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  zipCode: string;
  country: string;
  paymentMethod: string;
  cartItems: CartItem[];
  _createdAt: string;
};

// Define valid sort keys
type SortKey = "_createdAt" | "orderId";

type SortConfig = {
  key: SortKey;
  direction: "asc" | "desc";
};

// Mobile Order Card Component
const OrderCard = ({
  order,
  onViewDetails,
}: {
  order: Order;
  onViewDetails: (order: Order) => void;
}) => {
  const orderTotal = order.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Card className="w-full">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium text-sm">Order ID</p>
            <p className="text-base">{order.orderId}</p>
          </div>
          <Badge variant="outline">
            {order.paymentMethod === "bank-transfer"
              ? "Bank Transfer"
              : "Cash on Delivery"}
          </Badge>
        </div>

        <div className="space-y-1">
          <p className="font-medium text-sm">Customer</p>
          <p className="text-base">{`${order.firstName} ${order.lastName}`}</p>
          <p className="text-sm text-muted-foreground">{order.email}</p>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium text-sm">Date</p>
            <p className="text-base">
              {format(new Date(order._createdAt), "MMM d, yyyy")}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium text-sm">Total</p>
            <p className="text-base">${orderTotal.toFixed(2)}</p>
          </div>
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={() => onViewDetails(order)}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "_createdAt",
    direction: "desc",
  });

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "checkout"] {
            _id,
            orderId,
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            province,
            zipCode,
            country,
            paymentMethod,
            cartItems,
            _createdAt
          }
        `);
        setOrders(data);
        setFilteredOrders(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const searchLower = searchTerm?.toLowerCase() || "";

      // Safely handle potentially null/undefined values
      const orderIdMatch =
        order.orderId?.toLowerCase()?.includes(searchLower) || false;
      const emailMatch =
        order.email?.toLowerCase()?.includes(searchLower) || false;
      const nameMatch = `${order.firstName || ""} ${order.lastName || ""}`
        .toLowerCase()
        .includes(searchLower);

      return orderIdMatch || emailMatch || nameMatch;
    });
    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";

      if (sortConfig.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    setFilteredOrders(sorted);
  }, [orders, searchTerm, sortConfig]);

  const calculateOrderTotal = (items: CartItem[]) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  return isLoading ? (
    <div className="flex items-center justify-center h-screen">loading...</div>
  ) : (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Orders</h1>
          <Badge variant="secondary" className="text-sm">
            {filteredOrders.length} total
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full sm:w-[300px]"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort("_createdAt")}>
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("orderId")}>
                Order ID
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {currentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-muted/50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="font-medium">{order.orderId}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{`${order.firstName} ${order.lastName}`}</span>
                        <span className="text-sm text-muted-foreground">
                          {order.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {format(new Date(order._createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      ${calculateOrderTotal(order.cartItems).toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Badge variant="outline">
                        {order.paymentMethod === "bank-transfer"
                          ? "Bank Transfer"
                          : "Cash on Delivery"}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {currentOrders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <Pagination
          totalItems={filteredOrders.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Order Details
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Information & Shipping Details */}
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                      <Package2 className="h-5 w-5" />
                      Order Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm sm:text-base">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order ID:</span>
                      <span className="font-medium">
                        {selectedOrder.orderId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>
                        {format(new Date(selectedOrder._createdAt), "PPP")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Payment Method:
                      </span>
                      <Badge variant="outline">
                        {selectedOrder.paymentMethod === "bank-transfer"
                          ? "Bank Transfer"
                          : "Cash on Delivery"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Shipping Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm sm:text-base">
                    <div className="space-y-1">
                      <p className="font-medium">{`${selectedOrder.firstName} ${selectedOrder.lastName}`}</p>
                      <p>{selectedOrder.address}</p>
                      <p>{`${selectedOrder.city}, ${selectedOrder.province} ${selectedOrder.zipCode}`}</p>
                      <p>{selectedOrder.country}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {selectedOrder.phone}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {selectedOrder.email}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm sm:text-base">
                      <thead>
                        <tr className="border-b">
                          <th className="px-2 sm:px-4 py-2 text-left">
                            Product
                          </th>
                          <th className="px-2 sm:px-4 py-2 text-right">
                            Quantity
                          </th>
                          <th className="px-2 sm:px-4 py-2 text-right">
                            Price
                          </th>
                          <th className="px-2 sm:px-4 py-2 text-right">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedOrder.cartItems.map((item, index) => (
                          <tr key={index}>
                            <td className="px-2 sm:px-4 py-2">{item.title}</td>
                            <td className="px-2 sm:px-4 py-2 text-right">
                              {item.quantity}
                            </td>
                            <td className="px-2 sm:px-4 py-2 text-right">
                              ${item.price.toFixed(2)}
                            </td>
                            <td className="px-2 sm:px-4 py-2 text-right">
                              ${(item.quantity * item.price).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                        <tr className="font-medium">
                          <td
                            colSpan={3}
                            className="px-2 sm:px-4 py-2 text-right"
                          >
                            Total
                          </td>
                          <td className="px-2 sm:px-4 py-2 text-right">
                            $
                            {calculateOrderTotal(
                              selectedOrder.cartItems
                            ).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
