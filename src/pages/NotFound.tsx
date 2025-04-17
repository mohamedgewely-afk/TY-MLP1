
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ToyotaLayout from "@/components/ToyotaLayout";

const NotFound = () => {
  return (
    <ToyotaLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
        <h1 className="text-6xl font-bold text-toyota-red mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md text-center mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/" className="bg-toyota-red hover:bg-toyota-darkred">
            Return to Homepage
          </Link>
        </Button>
      </div>
    </ToyotaLayout>
  );
};

export default NotFound;
