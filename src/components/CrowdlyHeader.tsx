
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Menu, X, LogOut, Bell, MessageSquare, User, Users, Heart, Gift, Settings, HelpCircle } from "lucide-react";
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
import LoginForm from "@/components/LoginForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const CrowdlyHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("leoforce@example.com");
  const [password, setPassword] = useState("12345678qwas!");
  const [showPassword, setShowPassword] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [messageCount, setMessageCount] = useState(5);

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

  // Create initials from email for avatar
  const getInitials = (email: string) => {
    if (!email) return "U";
    const parts = email.split('@');
    if (parts.length === 0) return "U";
    const name = parts[0];
    return name.substring(0, 1).toUpperCase();
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
            
            <div className="space-x-4 flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  {/* Notification Bell Icon */}
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </Button>
                  
                  {/* Message Icon */}
                  <Button variant="ghost" size="icon" className="relative">
                    <MessageSquare className="h-5 w-5" />
                    {messageCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {messageCount}
                      </span>
                    )}
                  </Button>
                  
                  {/* User Profile Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative p-0 h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" alt={user.email || ""} />
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {getInitials(user.email || "")}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <div className="flex items-center p-2 space-x-2 border-b">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="" alt={user.email || ""} />
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {getInitials(user.email || "")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{user.email}</span>
                        </div>
                      </div>
                      
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link to="/profile" className="cursor-pointer flex items-center">
                            <User className="mr-2 h-4 w-4" /> Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" /> Friends
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" /> Groups
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" /> Communications
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Heart className="mr-2 h-4 w-4" /> Favorites
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Gift className="mr-2 h-4 w-4" /> Friends' recommendations
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link to="/account-administration" className="cursor-pointer flex items-center">
                            <Settings className="mr-2 h-4 w-4" /> Account settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <HelpCircle className="mr-2 h-4 w-4" /> Help
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                        <LogOut className="mr-2 h-4 w-4" /> Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
          
          <Button 
            className="md:hidden text-gray-500 focus:outline-none" 
            variant="ghost"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
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
                <SelectItem value="Russian">Russian</SelectItem>
                <SelectItem value="Chinese">中文</SelectItem>
                <SelectItem value="Portuguese">Portuguese</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="Arabic">Arabic</SelectItem>
              </SelectContent>
            </Select>
            
            {user ? (
              <>
                <div className="text-sm font-medium">{user.email}</div>
                <Link to="/profile" className="flex items-center py-2">
                  <User className="h-4 w-4 mr-2" /> Profile
                </Link>
                <div className="flex items-center py-2">
                  <Users className="h-4 w-4 mr-2" /> Friends
                </div>
                <div className="flex items-center py-2">
                  <Users className="h-4 w-4 mr-2" /> Groups
                </div>
                <div className="flex items-center py-2">
                  <MessageSquare className="h-4 w-4 mr-2" /> Communications
                </div>
                <div className="flex items-center py-2">
                  <Heart className="h-4 w-4 mr-2" /> Favorites
                </div>
                <div className="flex items-center py-2">
                  <Gift className="h-4 w-4 mr-2" /> Friends' recommendations
                </div>
                <div className="flex items-center py-2">
                  <Settings className="h-4 w-4 mr-2" /> Account settings
                </div>
                <div className="flex items-center py-2">
                  <HelpCircle className="h-4 w-4 mr-2" /> Help
                </div>
                <Button variant="outline" onClick={handleLogout} className="flex items-center justify-center">
                  <LogOut className="h-4 w-4 mr-1" /> 
                  <EditableText id="mobile-logout">Sign out</EditableText>
                </Button>
              </>
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
