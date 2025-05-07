
import React from "react";
import { Link } from "react-router-dom";
import CrowdlyHeader from "@/components/CrowdlyHeader";
import CrowdlyFooter from "@/components/CrowdlyFooter";
import EditableText from "@/components/EditableText";

const Sitemap = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <CrowdlyHeader />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-8">
          <EditableText id="sitemap-title">Sitemap</EditableText>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">
              <EditableText id="sitemap-main-pages">Main Pages</EditableText>
            </h2>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-blue-600 hover:underline">
                  <EditableText id="sitemap-home">Home</EditableText>
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-blue-600 hover:underline">
                  <EditableText id="sitemap-register">Register</EditableText>
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-blue-600 hover:underline">
                  <EditableText id="sitemap-login">Login</EditableText>
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-blue-600 hover:underline">
                  <EditableText id="sitemap-profile">Profile</EditableText>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">
              <EditableText id="sitemap-features">Features</EditableText>
            </h2>
            <ul className="space-y-2">
              <li>
                <Link to="/suggest-feature" className="text-blue-600 hover:underline">
                  <EditableText id="sitemap-suggest-feature">Suggest a Feature</EditableText>
                </Link>
              </li>
              <li>
                <Link to="/account-administration" className="text-blue-600 hover:underline">
                  <EditableText id="sitemap-account-admin">Account Administration</EditableText>
                </Link>
              </li>
              <li>
                <Link to="/new-story-template" className="text-blue-600 hover:underline">
                  <EditableText id="sitemap-new-story">New Story Template</EditableText>
                </Link>
              </li>
              <li>
                <Link to="/story-for-consumers" className="text-blue-600 hover:underline">
                  <EditableText id="sitemap-story-consumers">Story for consumers</EditableText>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">
              <EditableText id="sitemap-meta">Meta</EditableText>
            </h2>
            <ul className="space-y-2">
              <li>
                <Link to="/sitemap" className="text-blue-600 hover:underline">
                  <EditableText id="sitemap-sitemap">Sitemap</EditableText>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <CrowdlyFooter />
    </div>
  );
};

export default Sitemap;
