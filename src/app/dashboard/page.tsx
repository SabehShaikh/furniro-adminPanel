import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Smile, Truck, CheckCircle, ThumbsUp } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-12 px-4 md:px-8 lg:px-12 py-12 text-center md:text-left">
      {/* Welcome Section */}
      <Card className="p-6 mt-8 text-center md:text-left bg-gradient-to-r from-gray-100 to-gray-200">
        <CardHeader className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <CardTitle className="text-4xl font-bold">
              Welcome to Furniro! 🛋️
            </CardTitle>
            <p className="text-gray-600 mt-2 text-lg">
              Discover stylish and comfortable furniture to make your home truly
              yours.
            </p>
          </div>
          <Smile className="h-12 w-12 text-gray-500 hidden md:block" />
        </CardHeader>
        <CardContent className="mt-4">
          <Link href="/products">
            <Button className="bg-primary hover:bg-primary-dark px-6 py-3 text-white rounded-lg text-lg">
              Explore Products
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* About Us Section */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center gap-2">
            <Info className="h-8 w-8 text-primary" /> About Furniro
          </CardTitle>
        </CardHeader>
        <CardContent className="text-lg text-gray-700 leading-relaxed">
          <p>
            Furniro is your trusted destination for high-quality furniture that
            blends elegance and functionality. We offer a wide range of
            products, from cozy sofas to sleek dining sets, crafted with premium
            materials.
          </p>
          <p className="mt-4">
            Our mission is to provide top-tier furniture at affordable prices,
            ensuring customer satisfaction with every purchase. Let us help you
            create a home that reflects your style and comfort.
          </p>
        </CardContent>
      </Card>

      {/* Why Choose Us Section */}
      <div className="bg-primary/5 py-12 px-4 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-8">
          Why Choose Furniro?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex items-start space-x-4">
            <CheckCircle className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold text-xl mb-2">Premium Quality</h3>
              <p className="text-gray-700">
                Crafted from the finest materials to ensure durability and
                style.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Truck className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold text-xl mb-2">
                Fast & Reliable Delivery
              </h3>
              <p className="text-gray-700">
                Enjoy quick and secure shipping to your doorstep.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <ThumbsUp className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold text-xl mb-2">
                Customer Satisfaction
              </h3>
              <p className="text-gray-700">
                Our dedicated team is here to assist you every step of the way.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
