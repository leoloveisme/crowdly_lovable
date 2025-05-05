
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Menu, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const CrowdlyHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState("English");
  const [showPopover, setShowPopover] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLogin = () => {
    setShowLogin(!showLogin);
  };

  return (
    <header className="bg-white p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="mr-6 bg-gray-100 p-5 flex items-center justify-center">
            <div className="text-2xl font-bold text-gray-300">LOGO</div>
          </Link>
          <h1 className="text-2xl font-bold text-[#1A1F2C] hidden md:block">
            Crowdly where YOUR entertainment is
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex space-x-4 items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <Input 
                type="text" 
                placeholder="Search" 
                className="w-40 md:w-60 pl-10"
              />
            </div>
            
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Russian">Russian</SelectItem>
                <SelectItem value="Chinese">中文</SelectItem>
                <SelectItem value="Portuguese">Portuguese</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="Arabic">Arabic</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="space-x-4">
              <Button variant="link" onClick={() => window.location.href = "/register"}>Register</Button>
              <Button variant="link" onClick={toggleLogin}>Login</Button>
            </div>
          </div>
          
          {/* Hamburger menu icon - visible on all screen sizes */}
          <Popover open={showPopover} onOpenChange={setShowPopover}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0">
              <div className="relative p-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={() => setShowPopover(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="space-y-2 pt-4">
                  <div className="border-b pb-2">
                    <Link 
                      to="/suggest-feature" 
                      className="block p-2 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setShowPopover(false)}
                    >
                      Suggest a Feature
                    </Link>
                  </div>
                  <div>
                    <Link 
                      to="/account-administration" 
                      className="block p-2 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setShowPopover(false)}
                    >
                      Account Administration
                    </Link>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <button 
            className="md:hidden text-gray-500 focus:outline-none" 
            onClick={toggleMenu}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>
      </div>

      {showLogin && (
        <div className="container mx-auto mt-2">
          <div className="w-full md:w-64 p-4 bg-white border rounded shadow-md md:absolute md:right-4 md:top-16 z-10">
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1 text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-1 text-sm font-medium">Password</label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>
            <Button className="w-full">Login</Button>
          </div>
        </div>
      )}

      {isMenuOpen && (
        <div className="md:hidden mt-2">
          <div className="flex flex-col space-y-2 p-2 bg-white border-t">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <Input
                type="text"
                placeholder="Search"
                className="w-full pl-10"
              />
            </div>
            
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1" onClick={() => window.location.href = "/register"}>
                Register
              </Button>
              <Button variant="outline" className="flex-1" onClick={toggleLogin}>
                Login
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default CrowdlyHeader;
