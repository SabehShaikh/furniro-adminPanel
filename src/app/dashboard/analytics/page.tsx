"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgeDollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { client } from "@/sanity/lib/client";

interface CartItem {
  title: string;
  quantity: number;
  price: number;
  tags: string[];
  isNew: boolean;
  description: string;
  discountPercentage: number;
  originalPrice: number;
  productImage: string;
}

interface CheckoutOrder {
  _createdAt: string;
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
  additionalInfo?: string;
  cartItems: CartItem[];
  paymentMethod: "bank-transfer" | "cash-on-delivery";
}

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  monthlyData: Array<{
    month: string;
    sales: number;
    orders: number;
  }>;
  popularProducts: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  paymentMethods: Array<{
    name: string;
    value: number;
  }>;
  cityDistribution: Array<{
    name: string;
    value: number;
  }>;
}

const AnalyticsDashboard = () => {
  const [orders, setOrders] = useState<CheckoutOrder[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    monthlyData: [],
    popularProducts: [],
    paymentMethods: [],
    cityDistribution: [],
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const query = `*[_type == "checkout"] {
            orderId,
            cartItems,
            paymentMethod,
            city,
            _createdAt
          }`;

        const result = await client.fetch<CheckoutOrder[]>(query);
        if (result) {
          setOrders(result);
          processAnalytics(result);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const processAnalytics = (orders: CheckoutOrder[]) => {
    try {
      const productMap = new Map<string, number>();
      const cityMap = new Map<string, number>();
      const paymentMethodMap = new Map<string, number>();
      let totalRevenue = 0;

      // Process each order
      orders.forEach((order) => {
        if (!order.cartItems) return;

        // Calculate order total and update product counts
        order.cartItems.forEach((item) => {
          if (
            typeof item.price !== "number" ||
            typeof item.quantity !== "number"
          )
            return;

          const price = item.price * item.quantity;
          totalRevenue += price;

          if (item.title) {
            const currentCount = productMap.get(item.title) || 0;
            productMap.set(item.title, currentCount + item.quantity);
          }
        });

        // Update city distribution
        if (order.city) {
          const currentCityCount = cityMap.get(order.city) || 0;
          cityMap.set(order.city, currentCityCount + 1);
        }

        // Update payment method distribution
        if (order.paymentMethod) {
          const currentPaymentCount =
            paymentMethodMap.get(order.paymentMethod) || 0;
          paymentMethodMap.set(order.paymentMethod, currentPaymentCount + 1);
        }
      });

      // Process monthly data
      const monthlyDataMap = new Map<
        string,
        { month: string; sales: number; orders: number }
      >();

      orders.forEach((order) => {
        if (!order._createdAt || !order.cartItems) return;

        const date = new Date(order._createdAt);
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
        const currentData = monthlyDataMap.get(monthYear);

        const orderTotal = order.cartItems.reduce((sum, item) => {
          if (
            typeof item.price !== "number" ||
            typeof item.quantity !== "number"
          )
            return sum;
          return sum + item.price * item.quantity;
        }, 0);

        monthlyDataMap.set(monthYear, {
          month: new Date(date.getFullYear(), date.getMonth()).toLocaleString(
            "default",
            { month: "short" }
          ),
          sales: (currentData?.sales || 0) + orderTotal,
          orders: (currentData?.orders || 0) + 1,
        });
      });

      // Convert maps to arrays for charts
      const popularProducts = Array.from(productMap, ([name, value]) => ({
        name,
        value,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      const paymentMethods = Array.from(paymentMethodMap, ([name, value]) => ({
        name: name === "bank-transfer" ? "Bank Transfer" : "Cash on Delivery",
        value,
      }));

      const monthlyData = Array.from(monthlyDataMap.values()).sort(
        (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
      );

      const cityDistribution = Array.from(cityMap, ([name, value]) => ({
        name,
        value,
      }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      setAnalytics({
        totalRevenue,
        totalOrders: orders.length,
        monthlyData,
        popularProducts,
        paymentMethods,
        cityDistribution,
      });
    } catch (error) {
      console.error("Error processing analytics:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Analytics Dashboard
      </h1>

      {/* Conditional Rendering based on Orders */}
      {orders.length === 0 ? (
        <div className="text-center text-gray-500">
          {analytics.totalOrders === 0
            ? "No orders available."
            : "Loading orders..."}
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            {[
              {
                title: "Total Revenue",
                icon: (
                  <BadgeDollarSign className="h-5 w-5 text-muted-foreground" />
                ),
                value: `$ ${analytics.totalRevenue.toLocaleString()}`,
              },
              {
                title: "Total Orders",
                icon: (
                  <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                ),
                value: analytics.totalOrders,
              },
              {
                title: "Avg. Order Value",
                icon: <TrendingUp className="h-5 w-5 text-muted-foreground" />,
                value: `$ ${analytics.totalOrders ? Math.round(analytics.totalRevenue / analytics.totalOrders).toLocaleString() : 0}`,
              },
              {
                title: "Cities Reached",
                icon: <Users className="h-5 w-5 text-muted-foreground" />,
                value: analytics.cityDistribution.length,
              },
            ].map((item, index) => (
              <Card key={index} className="p-4">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {item.title}
                  </CardTitle>
                  {item.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">
                    {item.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="flex flex-wrap gap-2 justify-center">
              {["Overview", "Products", "Geography"].map((tab) => (
                <TabsTrigger key={tab} value={tab.toLowerCase()}>
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Sales Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-60 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="sales"
                          stroke="#8884d8"
                          name="Sales (Rs.)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Products & Payment Methods */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Popular Products",
                    chart: (
                      <PieChart>
                        <Pie
                          data={analytics.popularProducts}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {analytics.popularProducts.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    ),
                  },
                  {
                    title: "Payment Methods",
                    chart: (
                      <BarChart data={analytics.paymentMethods}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    ),
                  },
                ].map((item, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                          {item.chart}
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {["products", "geography"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {tab === "products"
                        ? "Product Performance"
                        : "Orders by City"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60 sm:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={
                            tab === "products"
                              ? analytics.popularProducts
                              : analytics.cityDistribution
                          }
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
