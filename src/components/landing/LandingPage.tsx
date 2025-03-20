import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MeeraLogo from "@/components/MeeraLogo";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <MeeraLogo className="h-16 md:h-20" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            Meera POS System
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            A complete point-of-sale and inventory management solution for
            maternity and fertility stores
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-gradient-meera hover:bg-pink-700 text-lg py-6 px-8"
              size="lg"
            >
              <Link to="/login">Sign In</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="text-lg py-6 px-8 border-2"
              size="lg"
            >
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            Key Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-pink-50 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Point of Sale</h3>
              <p className="text-gray-600">
                Fast and intuitive checkout process with barcode scanning and
                quick product search.
              </p>
            </div>

            <div className="bg-pink-50 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
                  <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
                  <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Inventory Management
              </h3>
              <p className="text-gray-600">
                Track stock levels in real-time with automatic updates and low
                stock alerts.
              </p>
            </div>

            <div className="bg-pink-50 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                  <line x1="2" y1="10" x2="22" y2="10"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Billing System</h3>
              <p className="text-gray-600">
                Comprehensive billing management with vendor tracking and
                payment processing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <MeeraLogo className="h-8 mr-2" />
            <span className="text-gray-600">© 2024 Meera POS System</span>
          </div>

          <div className="flex gap-6">
            <a href="#" className="text-gray-600 hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 hover:text-primary">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
