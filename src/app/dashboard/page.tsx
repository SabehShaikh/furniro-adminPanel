import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Package, ShoppingCart, Users } from 'lucide-react';

export default function DashboardPage() {
  // Mock data for demonstration
  const totalRevenue = 82650;
  const totalOrders = 1645;
  const totalCustomers = 1462;
  const topSellingProducts = [
    { name: 'Product A', sales: 1200 },
    { name: 'Product B', sales: 950 },
    { name: 'Product C', sales: 800 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Revenue</CardTitle>
            <LineChart className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalRevenue}</p>
            <p className="text-sm text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Orders</CardTitle>
            <ShoppingCart className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalOrders}</p>
            <p className="text-sm text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Customers</CardTitle>
            <Users className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalCustomers}</p>
            <p className="text-sm text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topSellingProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  <p>{product.name}</p>
                </div>
                <p className="font-bold">{product.sales} sales</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}