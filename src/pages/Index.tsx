
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CrowdlyHeader from "@/components/CrowdlyHeader";
import CrowdlyFooter from "@/components/CrowdlyFooter";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole('platform_admin');

  return (
    <div className="min-h-screen flex flex-col">
      <CrowdlyHeader />
      
      <div className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          {isAdmin && (
            <h2 className="text-4xl font-bold mb-2 text-red-600">
              You are logged in as platform admin
            </h2>
          )}
          <h1 className="text-4xl font-bold mb-6 text-[#1A1F2C]">Crowdly Entertainment Platform</h1>
          <p className="text-xl text-gray-600 mb-8">The entertainment platform where your voice matters</p>
          
          <div className="space-y-4">
            <p className="mb-2">We value your feedback and ideas!</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg">
                <Link to="/suggest-feature">Suggest a Feature</Link>
              </Button>
              <Button asChild variant="outline" className="px-8 py-6 text-lg">
                <Link to="/account-administration">Account Administration</Link>
              </Button>
              <Button asChild variant="outline" className="px-8 py-6 text-lg">
                <Link to="/new-story-template">New Story Template</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <CrowdlyFooter />
    </div>
  );
};

export default Index;
