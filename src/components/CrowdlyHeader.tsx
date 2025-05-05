import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Menu, X, LogOut } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { useEditableContent } from "@/contexts/EditableContentContext";
import { toast } from "@/hooks/use-toast";
import EditableText from "@/components/EditableText";

const CrowdlyHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("leoforce@example.com");
  const [password, setPassword] = useState("12345678qwas!");
  const [showPassword, setShowPassword] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { user, signIn, signOut } = useAuth();
  const { currentLanguage, setCurrentLanguage } = useEditableContent();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLogin = () => {
    if (user) return; // Don't show login form if user is logged in
    setShowLogin(!showLogin);
  };

  const handleLanguageChange = (value: string) => {
    setCurrentLanguage(value);
    toast({
      title: "Language changed",
      description: `Content is now displayed in ${value}`,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoggingIn(true);
      await signIn(email, password);
      setShowLogin(false);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="bg-white p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="mr-6 bg-gray-100 p-5 flex items-center justify-center">
            <div className="text-2xl font-bold text-gray-300">LOGO</div>
          </Link>
          <h1 className="text-2xl font-bold text-[#1A1F2C] hidden md:block">
            <EditableText id="header-title">
              Crowdly where YOUR entertainment is
            </EditableText>
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
            
            <Select value={currentLanguage} onValueChange={handleLanguageChange}>
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
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{user.email}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-1" /> 
                    <EditableText id="header-logout">Logout</EditableText>
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="link" onClick={() => window.location.href = "/register"}>
                    <EditableText id="header-register">Register</EditableText>
                  </Button>
                  <Button variant="link" onClick={toggleLogin}>
                    <EditableText id="header-login">Login</EditableText>
                  </Button>
                </>
              )}
            </div>
          </div>
          
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
                  {user && (
                    <div className="border-b pb-2 mb-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{user.email}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleLogout}
                          className="flex items-center"
                        >
                          <LogOut className="h-3 w-3 mr-1" /> 
                          <EditableText id="popover-logout">Logout</EditableText>
                        </Button>
                      </div>
                    </div>
                  )}
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

      {showLogin && !user && (
        <div className="container mx-auto mt-2">
          <div className="w-full md:w-64 p-4 bg-white border rounded shadow-md md:absolute md:right-4 md:top-16 z-10 relative">
            <LoginForm onClose={() => setShowLogin(false)} />
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
            
            <Select value={currentLanguage} onValueChange={handleLanguageChange}>
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
            
            {user ? (
              <div className="flex flex-col space-y-2">
                <div className="text-sm font-medium">{user.email}</div>
                <Button variant="outline" onClick={handleLogout} className="flex items-center justify-center">
                  <LogOut className="h-4 w-4 mr-1" /> 
                  <EditableText id="mobile-logout">Logout</EditableText>
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1" onClick={() => window.location.href = "/register"}>
                  <EditableText id="mobile-register">Register</EditableText>
                </Button>
                <Button variant="outline" className="flex-1" onClick={toggleLogin}>
                  <EditableText id="mobile-login">Login</EditableText>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default CrowdlyHeader;
