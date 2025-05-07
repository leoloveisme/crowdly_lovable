
import React from "react";
import { Link } from "react-router-dom";
import EditableText from "@/components/EditableText";

const CrowdlyFooter = () => {
  return (
    <footer className="bg-white py-8 mt-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-medium text-gray-800 mb-4">
              <EditableText id="footer-company-title">Company</EditableText>
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-500">
                <EditableText id="footer-about">About</EditableText>
              </a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">
                <EditableText id="footer-careers">Careers</EditableText>
              </a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">
                <EditableText id="footer-press">Press</EditableText>
              </a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">
                <EditableText id="footer-news">News</EditableText>
              </a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">
                <EditableText id="footer-blog">Blog</EditableText>
              </a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">
                <EditableText id="footer-support">Support</EditableText>
              </a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">
                <EditableText id="footer-terms">Terms & Conditions</EditableText>
              </a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">
                <EditableText id="footer-privacy">Privacy</EditableText>
              </a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-4">
              <EditableText id="footer-navigation-title">Finding your ways</EditableText>
            </h3>
            <ul className="space-y-2">
              <li><Link to="/sitemap" className="text-gray-600 hover:text-blue-500">
                <EditableText id="footer-sitemap">Sitemap</EditableText>
              </Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-4">
              <EditableText id="footer-community-title">Community</EditableText>
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-500">
                <EditableText id="footer-contact">Contact us</EditableText>
              </a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">
                <EditableText id="footer-feedback">Send feedback</EditableText>
              </a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">
                <EditableText id="footer-bug">Submit a bug report</EditableText>
              </a></li>
              <li><Link to="/suggest-feature" className="text-gray-600 hover:text-blue-500">
                <EditableText id="footer-feature">Suggest a feature</EditableText>
              </Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-4">
              <EditableText id="footer-social-title">Find us on</EditableText>
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-500">
                <EditableText id="footer-facebook">Facebook</EditableText>
              </a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">
                <EditableText id="footer-instagram">Instagram</EditableText>
              </a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">
                <EditableText id="footer-twitter">Twitter</EditableText>
              </a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">
                <EditableText id="footer-discord">Discord</EditableText>
              </a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">
                <EditableText id="footer-linkedin">LinkedIn</EditableText>
              </a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">
                <EditableText id="footer-youtube">YouTube</EditableText>
              </a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CrowdlyFooter;
