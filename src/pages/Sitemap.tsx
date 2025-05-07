
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CrowdlyHeader from "@/components/CrowdlyHeader";
import CrowdlyFooter from "@/components/CrowdlyFooter";
import { useAuth } from "@/contexts/AuthContext";
import EditableText from "@/components/EditableText";

const Index = () => {
  const { user, hasRole, roles } = useAuth();
  
  // Debug logging
  useEffect(() => {
    if (user) {
      console.log("Current user:", user?.email);
      console.log("User roles:", roles);
      console.log("Is admin?", hasRole('platform_admin'));
    } else {
      console.log("No user is logged in");
    }
  }, [user, roles, hasRole]);
  
  const isAdmin = user && hasRole('platform_admin');

  return (
    <div className="min-h-screen flex flex-col">
      <CrowdlyHeader />
      
      <div className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          {isAdmin && (
            <h2 className="text-4xl font-bold mb-2 text-red-600">
              <EditableText id="admin-message">
                You are logged in as platform admin
              </EditableText>
            </h2>
          )}
          <h1 className="text-4xl font-bold mb-6 text-[#1A1F2C]">
            <EditableText id="main-title">
              Crowdly Entertainment Platform
            </EditableText>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            <EditableText id="main-subtitle">
              The entertainment platform where your voice matters
            </EditableText>
          </p>
          
          <div className="space-y-4">
            <p className="mb-2">
              <EditableText id="feedback-message">
                We value your feedback and ideas!
              </EditableText>
            </p>


<div className="border-b pb-2">
                    <Link 
                      to="/suggest-feature" 
                      className="block p-2 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setShowPopover(false)}
                    >
                      <EditableText id="popover-suggest-feature">
                        Suggest a Feature
                      </EditableText>
                    </Link>
                  </div>
                  <div>
                    <Link 
                      to="/account-administration" 
                      className="block p-2 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setShowPopover(false)}
                    >
                      <EditableText id="popover-account-admin">
                        Account Administration
                      </EditableText>
                    </Link>
                  </div>
                  <div>
                    <Link 
                      to="/new-story-template" 
                      className="block p-2 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setShowPopover(false)}
                    >
                      <EditableText id="popover-new-story">
                        New Story Template
                      </EditableText>
                    </Link>
                  </div>
                  <div>
                    <Link 
                      to="/story-for-consumers" 
                      className="block p-2 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setShowPopover(false)}
                    >
                      <EditableText id="story-for-consumers">
                        Story for consumers
                      </EditableText>
                    </Link>
                  </div>
                  <div>
                    <Link 
                      to="/profile" 
                      className="block p-2 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setShowPopover(false)}
                    >
                      <EditableText id="popover-profile">
                        Profile
                      </EditableText>
                    </Link>
                  </div>
           
          </div>
        </div>
      </div>
      
      <CrowdlyFooter />
    </div>
  );
};

export default Sitemap;
