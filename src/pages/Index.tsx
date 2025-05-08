
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

          <p className="text-xl text-gray-600 mb-8">
            <EditableText id="main-subtitle">
              Favorites
            </EditableText>
          </p>

          <div className="space-y-4">
            <p className="mb-2">
              <EditableText id="favoriteStoriesDescriptionText">
                Here will be your favorite stories, which you've added to your favorites. 
On this page they're only for you to see. The same functionality will be available in the User Profile with Visibililty options: public, private, for friends only
              </EditableText>
            </p>           
          </div>


      <div className="container mx-auto px-4 pt-8 pb-16 flex-grow items-center justify-center">
        <div className="flex items-center justify-center justify-between items-start mb-8">
          <h1 className="text-3xl font-bold">
            <EditableText id="StoriesToLiveToExperience">Story(-ies) to live / to experience</EditableText> 
          </h1>
        </div>
     </div>



          <p className="text-xl text-gray-600 mb-8">
            <EditableText id="newestStories">
              Newest
            </EditableText>
          </p>


          <p className="text-xl text-gray-600 mb-8">
            <EditableText id="mostPopularStories">
              Most popular
            </EditableText>
          </p>


          <p className="text-xl text-gray-600 mb-8">
            <EditableText id="mostActiveStories">
              Most active
            </EditableText>
          </p>



      <div className="container mx-auto px-4 pt-8 pb-16 flex-grow items-center justify-center">
        <div className="flex items-center justify-center justify-between items-start mb-8">
          <h1 className="text-3xl font-bold">
            <EditableText id="LivingTheStories">Living / Experiencing the story(-ies)</EditableText> 
          </h1>
        </div>
     </div>

          <div className="space-y-4">
            <p className="mb-2">
              <EditableText id="LivingTheStoriesDescriptionText">
                Here will be your stories which you are currently living / experiencing, which you've added. 
This section is only for you to see. The same functionality will be available in the User Profile with Visibililty options: public, private, for friends only
              </EditableText>
            </p>           
          </div>


      <div className="container mx-auto px-4 pt-8 pb-16 flex-grow items-center justify-center">
        <div className="flex items-center justify-center justify-between items-start mb-8">
          <h1 className="text-3xl font-bold">
            <EditableText id="LivedThoseStories">Lived / Experienced those story(-ies)</EditableText> 
          </h1>
        </div>
     </div>

          <div className="space-y-4">
            <p className="mb-2">
              <EditableText id="LivedThoseStoriesDescriptionText">
                Here will be your stories which you already have lived / experienced. 
This section is only for you to see. The same functionality will be available in the User Profile with Visibililty options: public, private, for friends only
              </EditableText>
            </p>           
          </div>


        </div>
      </div>
      
      <CrowdlyFooter />
    </div>
  );
};

export default Index;
