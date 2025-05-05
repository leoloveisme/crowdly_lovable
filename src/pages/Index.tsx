
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CrowdlyHeader from "@/components/CrowdlyHeader";
import CrowdlyFooter from "@/components/CrowdlyFooter";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <CrowdlyHeader />
      
      <div className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold mb-6 text-[#1A1F2C]">Crowdly Entertainment Platform</h1>
          <p className="text-xl text-gray-600 mb-8">The entertainment platform where your voice matters</p>
          
          <div className="space-y-4">
            <p className="mb-2">We value your feedback and ideas!</p>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg">
              <Link to="/suggest-feature">Suggest a Feature</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <CrowdlyFooter />
    </div>
  );
};

export default Index;
