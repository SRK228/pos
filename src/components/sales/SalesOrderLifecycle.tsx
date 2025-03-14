import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SalesOrderLifecycle = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Order Lifecycle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px] p-4">
            <h3 className="text-lg font-medium mb-6 text-center">
              Life cycle of a Sales Order
            </h3>

            <div className="relative mt-8 mb-16 pt-8">
              {/* Order Placement Section */}
              <div className="flex justify-between mb-24">
                <div className="w-1/3 border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <h4 className="font-medium text-blue-700 mb-2">
                    Walk-in Customers (In Store)
                  </h4>
                  <p className="text-sm text-gray-600">
                    Customers visit the physical store
                  </p>
                </div>

                <div className="w-1/3 border border-blue-200 rounded-lg p-4 bg-blue-50 mx-4">
                  <h4 className="font-medium text-blue-700 mb-2">
                    Sale at the Counter
                  </h4>
                  <ul className="text-sm text-gray-600 list-disc pl-4">
                    <li>Desktop App</li>
                    <li>iOS App</li>
                    <li>Android App</li>
                    <li>Web App</li>
                  </ul>
                </div>

                <div className="w-1/3 border border-pink-200 rounded-lg p-4 bg-pink-50">
                  <h4 className="font-medium text-pink-700 mb-2">
                    Mark as Fulfilled
                  </h4>
                  <p className="text-sm text-gray-600">
                    Order is marked as complete
                  </p>
                </div>
              </div>

              {/* Phone Orders */}
              <div className="absolute left-0 top-40 border border-blue-200 rounded-lg p-4 bg-blue-50 w-1/3">
                <h4 className="font-medium text-blue-700 mb-2">
                  Phone Orders (Optional)
                </h4>
                <p className="text-sm text-gray-600">
                  Orders placed via phone call
                </p>
              </div>

              {/* Connecting Lines */}
              <div className="absolute left-[33%] top-16 w-[33%] border-t-2 border-dashed border-blue-300"></div>
              <div className="absolute left-[66%] top-16 w-[33%] border-t-2 border-dashed border-blue-300"></div>
              <div className="absolute left-[16%] top-40 h-16 border-l-2 border-dashed border-blue-300"></div>
              <div className="absolute left-[16%] top-56 w-[16%] border-t-2 border-dashed border-blue-300"></div>

              {/* Order Processing Section */}
              <div className="flex justify-between mb-24 mt-32">
                <div className="w-1/3 border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <h4 className="font-medium text-blue-700 mb-2">
                    Mobile Ordering (Optional)
                  </h4>
                  <p className="text-sm text-gray-600">Orders via mobile app</p>
                </div>

                <div className="w-1/3 border border-green-200 rounded-lg p-4 bg-green-50 mx-4">
                  <h4 className="font-medium text-green-700 mb-2">
                    Place Sale Order with the Zebra Mobile Device
                  </h4>
                  <ul className="text-sm text-gray-600 list-disc pl-4">
                    <li>iOS</li>
                    <li>Android</li>
                  </ul>
                </div>

                <div className="w-1/3 border border-green-200 rounded-lg p-4 bg-green-50">
                  <h4 className="font-medium text-green-700 mb-2">
                    Confirm Order
                  </h4>
                  <p className="text-sm text-gray-600">Verify order details</p>
                </div>
              </div>

              {/* Connecting Lines */}
              <div className="absolute left-[33%] top-96 w-[33%] border-t-2 border-dashed border-green-300"></div>
              <div className="absolute left-[66%] top-96 w-[33%] border-t-2 border-dashed border-green-300"></div>

              {/* Delivery Options Section */}
              <div className="flex justify-between mb-24 mt-8">
                <div className="w-1/3 border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <h4 className="font-medium text-blue-700 mb-2">
                    Web Ordering (Optional)
                  </h4>
                  <p className="text-sm text-gray-600">Orders via website</p>
                </div>

                <div className="w-1/3 border border-purple-200 rounded-lg p-4 bg-purple-50 mx-4">
                  <h4 className="font-medium text-purple-700 mb-2">
                    Place Sale Order in the E-Commerce Site
                  </h4>
                  <p className="text-sm text-gray-600">Online store orders</p>
                </div>

                <div className="flex flex-col w-1/3 gap-4">
                  <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                    <h4 className="font-medium text-purple-700 mb-2">
                      Store Pickup
                    </h4>
                    <p className="text-sm text-gray-600">
                      Customer collects from store
                    </p>
                  </div>

                  <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                    <h4 className="font-medium text-purple-700 mb-2">
                      Marked for Delivery
                    </h4>
                    <p className="text-sm text-gray-600">
                      Prepared for shipping
                    </p>
                  </div>
                </div>
              </div>

              {/* Connecting Lines */}
              <div className="absolute left-[33%] top-[440px] w-[33%] border-t-2 border-dashed border-purple-300"></div>
              <div className="absolute left-[66%] top-[440px] w-[33%] border-t-2 border-dashed border-purple-300"></div>

              {/* Final Delivery Section */}
              <div className="flex justify-end gap-4 mt-8">
                <div className="w-1/3 border border-purple-200 rounded-lg p-4 bg-purple-50">
                  <h4 className="font-medium text-purple-700 mb-2">
                    Home Delivery
                  </h4>
                  <p className="text-sm text-gray-600">
                    Shipped to customer's address
                  </p>
                </div>

                <div className="w-1/3 border border-purple-200 rounded-lg p-4 bg-purple-50">
                  <h4 className="font-medium text-purple-700 mb-2">
                    Create Package and Ship
                  </h4>
                  <p className="text-sm text-gray-600">
                    Prepare package for shipping
                  </p>
                </div>
              </div>

              {/* Payment Section */}
              <div className="absolute right-0 top-40 border border-green-200 rounded-lg p-4 bg-green-50 w-1/3">
                <h4 className="font-medium text-green-700 mb-2">
                  Record Payment
                </h4>
                <p className="text-sm text-gray-600">
                  Process payment transaction
                </p>
              </div>

              {/* Delivery Status */}
              <div className="absolute right-0 top-[500px] border border-green-200 rounded-lg p-4 bg-green-50 w-1/3">
                <h4 className="font-medium text-green-700 mb-2">
                  Mark as Delivered
                </h4>
                <p className="text-sm text-gray-600">
                  Confirm successful delivery
                </p>
              </div>

              {/* Additional Connecting Lines */}
              <div className="absolute right-[16%] top-40 h-16 border-l-2 border-dashed border-green-300"></div>
              <div className="absolute right-[16%] top-56 w-[16%] border-t-2 border-dashed border-green-300"></div>
              <div className="absolute right-[16%] top-[500px] h-16 border-l-2 border-dashed border-green-300"></div>
              <div className="absolute right-[16%] top-[516px] w-[16%] border-t-2 border-dashed border-green-300"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesOrderLifecycle;
