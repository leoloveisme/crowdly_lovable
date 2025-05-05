
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, Info, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import CrowdlyHeader from "@/components/CrowdlyHeader";
import CrowdlyFooter from "@/components/CrowdlyFooter";

interface Attachment {
  id: number;
  name: string;
  type: string;
}

const SuggestFeature = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [visibilityOption, setVisibilityOption] = useState<string>("public");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [telephone, setTelephone] = useState<string>("");
  const [canContact, setCanContact] = useState<string>("");
  const [contactMethod, setContactMethod] = useState<string>("");
  const [createAccount, setCreateAccount] = useState<string>("no");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [featureDescription, setFeatureDescription] = useState<string>("");
  const [attachments, setAttachments] = useState<Attachment[]>([
    { id: 1, name: "Document.pdf", type: "pdf" },
    { id: 2, name: "Document.docx", type: "docx" },
    { id: 3, name: "Image.jpeg", type: "jpeg" }
  ]);
  
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFile = files[0];
      const newAttachment: Attachment = {
        id: attachments.length + 1,
        name: newFile.name,
        type: newFile.name.split('.').pop() || "",
      };
      
      setAttachments([...attachments, newAttachment]);
      toast({
        title: "File uploaded",
        description: `${newFile.name} has been attached`,
      });
    }
  };
  
  const deleteAttachment = (id: number) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Feature suggestion submitted",
      description: "Thank you for your suggestion!",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CrowdlyHeader />
      
      <div className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-2 text-[#1A1F2C]">Suggest a feature</h1>
        
        <div className="bg-black text-white text-center text-sm py-1 px-4 rounded mb-4">
          Your suggestion will be published on our website
        </div>
        
        <div className="mb-6 text-center text-gray-500 text-sm">
          Your feature request will be published on our website.
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Visibility Options */}
          <div className="flex justify-center space-x-6 mb-6">
            <div className="flex items-center">
              <input
                type="radio"
                id="public"
                checked={visibilityOption === "public"}
                onChange={() => setVisibilityOption("public")}
                className="mr-1"
              />
              <label htmlFor="public" className="mr-1">Public</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={16} className="text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your suggestion will be visible to everyone</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="anonymous"
                checked={visibilityOption === "anonymous"}
                onChange={() => setVisibilityOption("anonymous")}
                className="mr-1"
              />
              <label htmlFor="anonymous" className="mr-1">Anonymous</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={16} className="text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your name won't be displayed</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="private"
                checked={visibilityOption === "private"}
                onChange={() => setVisibilityOption("private")}
                className="mr-1"
              />
              <label htmlFor="private" className="mr-1">Private</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={16} className="text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Only administrators will see this suggestion</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="firstName">First name</Label>
              <Input 
                id="firstName"
                type="text" 
                placeholder="Input text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last name</Label>
              <Input 
                id="lastName"
                type="text" 
                placeholder="Input text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          
          {/* Contact Information Section */}
          <div className="bg-gray-200 p-4 rounded mb-6">
            <div className="text-gray-700 mb-4">
              This section won't be displayed on the feature suggestion output page
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="telephone">Telephone</Label>
                <Input 
                  id="telephone"
                  type="tel" 
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <Label className="block mb-2">Can we contact you? (in case we have questions)</Label>
              <RadioGroup value={canContact} onValueChange={setCanContact} className="flex space-x-4">
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            {canContact === "yes" && (
              <div className="mb-4">
                <Label className="block mb-2">What is your preferred way of contacting you?</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-1">
                    <Checkbox id="contactEmail" checked={contactMethod === "email"} onCheckedChange={() => setContactMethod("email")} />
                    <Label htmlFor="contactEmail">Email</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Checkbox id="contactPhone" checked={contactMethod === "telephone"} onCheckedChange={() => setContactMethod("telephone")} />
                    <Label htmlFor="contactPhone">Telephone</Label>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Account Creation Section */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Label htmlFor="createAccount" className="mr-2">Would you like to create an account?</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={16} className="text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>You can create an account on this platform</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={createAccount} onValueChange={setCreateAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
              
              {createAccount === "yes" && (
                <div className="flex items-center space-x-2">
                  <div className="relative flex-grow">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                  <Button>Save</Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-2">
            <p className="text-sm">
              In case you already have an account you can{" "}
              <a href="/login" className="text-blue-500">Login</a>
            </p>
          </div>
          
          {/* Feature Description */}
          <div className="mb-6">
            <Label htmlFor="featureDescription" className="block mb-2">
              Please describe the feature you're suggesting here
            </Label>
            <Textarea
              id="featureDescription"
              value={featureDescription}
              onChange={(e) => setFeatureDescription(e.target.value)}
              rows={6}
              className="w-full"
            />
          </div>
          
          {/* Attachments */}
          <div className="mb-6">
            <Label className="block mb-2">Attachments</Label>
            <div className="flex items-center mb-4">
              <Input className="w-auto mr-2" placeholder="input text" readOnly onClick={handleFileUpload} />
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange} 
              />
              <Button type="button" onClick={handleFileUpload} className="bg-blue-500 hover:bg-blue-600">
                Add
              </Button>
            </div>
            
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="flex justify-between items-center">
                  <div>
                    <span className="mr-2">{attachment.id}.</span>
                    <span>{attachment.name}</span>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => deleteAttachment(attachment.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="mb-6">
            <Button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
            >
              Send
            </Button>
          </div>
          
          {/* Form Instructions */}
          <div className="mb-6">
            <div className="flex items-center mb-1">
              <span className="mr-2">None of the fields is compulsory</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={16} className="text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>You can submit an empty form</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-gray-500 text-sm">
              If you try to send an empty form it won't send.
            </p>
          </div>
        </form>
      </div>
      
      <CrowdlyFooter />
    </div>
  );
};

export default SuggestFeature;
