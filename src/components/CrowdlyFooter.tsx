
import React from "react";

const CrowdlyFooter = () => {
  return (
    <footer className="bg-white py-8 mt-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-medium text-gray-800 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-500">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Press</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">News</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Support</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Terms & Conditions</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Privacy</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-4">Community</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Contact us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Send feedback</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Submit a bug report</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Suggest a feature</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-4">Find us on</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Facebook</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Instagram</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Twitter</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Discord</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">LinkedIn</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">YouTube</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CrowdlyFooter;
