import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Edit, 
  Info, 
  X, 
  Plus,
  Check,
  ChevronDown,
  Upload,
  Grid2x2,
  Columns4
} from "lucide-react";
import { Link } from "react-router-dom";
import CrowdlyHeader from "@/components/CrowdlyHeader";
import CrowdlyFooter from "@/components/CrowdlyFooter";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import EditableText from "@/components/EditableText";

const Profile = () => {
  const [name, setName] = useState("Username");
  const [about, setAbout] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [canBeTagged, setCanBeTagged] = useState(true);
  const [anyoneCanEdit, setAnyoneCanEdit] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  // For the revision history
  const revisions = [
    { id: 1, text: "Text 1", time: "11:28" },
    { id: 2, text: "Text 2", time: "12:15" },
    { id: 3, text: "Text 3", time: "14:30" },
  ];
  
  // New state for revisions comparison functionality
  const [selectedRevisions, setSelectedRevisions] = useState<number[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [activeLayoutOption, setActiveLayoutOption] = useState<number | null>(null);

  // Stats for stories and contributions
  const stats = {
    author: {
      text: 5,
      images: 50,
      audio: 10,
      video: 5
    },
    consumer: {
      text: 5,
      images: 50,
      audio: 10,
      video: 5
    },
    producer: {
      story: 5
    },
    community: {
      contributing: {
        text: 5,
        images: 50,
        audio: 10,
        video: 5
      },
      sentFeedback: 5,
      suggestedFeatures: 50,
      submittedBugReports: 10,
      contactRequests: 5
    }
  };

  // Updated contributions data to match the screenshot
  const contributions = [
    { 
      id: 1, 
      storyTitle: "The story title", 
      chapterName: "Chapter title/edit",  
      date: "2023-05-01",
      time: "11:28",
      words: 550,
      likes: 3
    },
    { 
      id: 2, 
      storyTitle: "Another story", 
      chapterName: "Chapter 5",
      date: "2023-05-03",
      time: "14:15",
      words: 320,
      likes: 7
    },
    { 
      id: 3, 
      storyTitle: "Epic Journey", 
      chapterName: "Introduction",
      date: "2023-05-05",
      time: "09:45",
      words: 480,
      likes: 12
    }
  ];

  const handleAddInterest = () => {
    if (newInterest && !interests.includes(newInterest)) {
      setInterests([...interests, newInterest]);
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const handleProfileImageChange = (imageUrl: string) => {
    setProfileImage(imageUrl);
    setIsUploadDialogOpen(false);
  };
  
  // Functions for revision comparison
  const toggleCompare = () => {
    setCompareOpen(!compareOpen);
  };

  const toggleRevisionSelection = (revisionId: number) => {
    setSelectedRevisions(prev => {
      if (prev.includes(revisionId)) {
        return prev.filter(id => id !== revisionId);
      } else {
        // Limit to 4 selections
        if (prev.length >= 4) {
          return [...prev.slice(1), revisionId];
        }
        return [...prev, revisionId];
      }
    });
  };
  
  const handleLayoutOptionClick = (layoutIndex: number) => {
    setActiveLayoutOption(layoutIndex);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CrowdlyHeader />
      
      <div className="container mx-auto px-4 pt-8 pb-16 flex-grow">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold">
            <EditableText id="profile-title">Profile</EditableText> <Info className="inline h-5 w-5 text-gray-400" />
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end">
              <div className="flex items-center mb-1">
                <Checkbox 
                  id="private-profile" 
                  checked={isPrivate} 
                  onCheckedChange={() => setIsPrivate(!isPrivate)} 
                  className="mr-2" 
                />
                <Label htmlFor="private-profile">
                  <EditableText id="private-label">private</EditableText>
                </Label>
              </div>
              <div className="flex items-center mb-1">
                <Checkbox 
                  id="can-be-tagged" 
                  checked={canBeTagged} 
                  onCheckedChange={() => setCanBeTagged(!canBeTagged)} 
                  className="mr-2" 
                />
                <Label htmlFor="can-be-tagged">
                  <EditableText id="tag-label">can be tagged any time</EditableText>
                </Label>
              </div>
            </div>
            <div className="border border-gray-300 p-2 rounded-md">
              <div className="grid grid-cols-3 gap-1">
                <Button variant="ghost" size="sm" className="p-1 h-auto">
                  <span className="text-xl">≡</span>
                </Button>
                <Button variant="ghost" size="sm" className="p-1 h-auto">
                  <span className="text-xl">⋮</span>
                </Button>
                <Button variant="ghost" size="sm" className="p-1 h-auto">
                  <span className="text-xl">⋯</span>
                </Button>
                <Button variant="ghost" size="sm" className="p-1 h-auto">
                  <span className="text-xl">⬒</span>
                </Button>
                <Button variant="ghost" size="sm" className="p-1 h-auto">
                  <span className="text-xl">⬓</span>
                </Button>
                <Button variant="ghost" size="sm" className="p-1 h-auto">
                  <span className="text-xl">⬒</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* User Identity Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="p-1 h-7 w-7">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-1 h-7 w-7">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="border border-gray-300 rounded-md p-8 flex items-center justify-center">
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Avatar className="h-20 w-20 cursor-pointer">
                    {profileImage ? (
                      <AvatarImage src={profileImage} alt={name} />
                    ) : (
                      <AvatarImage src="/placeholder.svg" alt={name} />
                    )}
                    <AvatarFallback>UN</AvatarFallback>
                  </Avatar>
                </DialogTrigger>
                <ProfilePictureUpload onImageChange={handleProfileImageChange} />
              </Dialog>
            </div>
            
            <div className="flex items-center justify-between">
              
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="p-1 h-7 w-7">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-1 h-7 w-7">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="pr-20" 
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Checkbox 
                  id="anyone-can-edit" 
                  checked={anyoneCanEdit} 
                  onCheckedChange={() => setAnyoneCanEdit(!anyoneCanEdit)} 
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="font-semibold">
                <EditableText id="upload-label">Upload</EditableText>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="p-1 h-7 w-7">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-1 h-7 w-7">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="border border-gray-300 rounded-md p-8 flex items-center justify-center mb-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Avatar className="h-20 w-20 cursor-pointer">
                    <AvatarImage src="/placeholder.svg" alt="Upload" />
                    <AvatarFallback>UP</AvatarFallback>
                  </Avatar>
                </DialogTrigger>
                <ProfilePictureUpload onImageChange={() => {}} />
              </Dialog>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-blue-600">Save</Button>
              <Button size="sm" variant="outline">Undo</Button>
            </div>
            
          </div>
          
          <div className="flex flex-col">
            <div className="text-xs text-gray-500 mb-2">
              <EditableText id="copy-note">Can be copied any time</EditableText>
            </div>
            <div className="text-right mb-4">
              <Button variant="link" size="sm" className="text-blue-500 p-0">
                <Link to="/account-administration">
                  <EditableText id="account-admin-link">Account administration</EditableText>
                </Link>
              </Button>
            </div>
            
            <div className="mt-auto mb-2">
              <h2 className="text-xl font-bold mb-2">
                <EditableText id="about-heading">About</EditableText>
              </h2>
              <div className="border-t border-b border-gray-200 py-4">
                <Input 
                  className="border-0 p-0 shadow-none" 
                  placeholder="Write about yourself..." 
                  value={about} 
                  onChange={(e) => setAbout(e.target.value)} 
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Interests/Hobbies Section */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-bold mr-2">
              <EditableText id="interests-heading">Interests/Hobbies</EditableText>
            </h2>
            <Info className="h-5 w-5 text-gray-400" />
            <div className="ml-auto flex items-center">
              <Button variant="ghost" size="sm" className="p-1 h-7 w-7">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1 h-7 w-7">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="flex items-center mb-2">
              <Label htmlFor="interests-input" className="text-sm text-gray-500 italic mr-2">
                <EditableText id="interests-instruction">
                  Please enter your interests comma separated
                </EditableText>
              </Label>
            </div>
            <div className="flex gap-2">
              <Input 
                id="interests-input"
                value={newInterest} 
                onChange={(e) => setNewInterest(e.target.value)} 
                placeholder="Add interests..." 
                className="flex-grow" 
              />
              <Button onClick={handleAddInterest} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {interests.map((interest, index) => (
              <div key={index} className="bg-gray-100 rounded-full px-3 py-1 flex items-center gap-1">
                <span>{interest}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => handleRemoveInterest(interest)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Revisions Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            
              <span className="text-blue-500 text-sm hover:underline cursor-pointer"><EditableText id="revisions-heading">Revisions</EditableText></span>
          
            <Info className="h-5 w-5 text-gray-400" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-4 text-sm text-gray-600">
                    <EditableText id="compare-tooltip-trigger">
                      Compare up to 4 revisions
                    </EditableText>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    <EditableText id="compare-tooltip-content">
                      You can select and compare up to 4 revisions
                    </EditableText>
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="mb-4">
            <Table>
              <TableBody>
                {revisions.map((revision) => (
                  <TableRow key={revision.id}>
                    <TableCell className="font-medium w-10">{revision.id}</TableCell>
                    <TableCell className="text-blue-500">{revision.time}</TableCell>
                    <TableCell className="w-8">
                      <Checkbox 
                        id={`revision-${revision.id}`} 
                        checked={selectedRevisions.includes(revision.id)}
                        onCheckedChange={() => toggleRevisionSelection(revision.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3}>
                    <div className="flex justify-between items-center">
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="text-blue-500 p-0"
                        onClick={toggleCompare}
                      >
                        Compare
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1 h-7 w-7">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          {/* Comparison Container */}
          {compareOpen && selectedRevisions.length > 0 && (
            <div className="border rounded-md p-4 bg-gray-50 mb-4">
              <h4 className="font-medium mb-2">
                <EditableText id="compare-revisions-title">
                  Compare Revisions
                </EditableText>
              </h4>
              
              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">
                  <EditableText id="layout-options-title">
                    Layout options:
                  </EditableText>
                </h5>
                
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {/* Option 1: one horizontal and two vertical */}
                  <button 
                    onClick={() => handleLayoutOptionClick(0)}
                    className={`border p-2 flex items-center justify-center ${activeLayoutOption === 0 ? 'border-blue-500 bg-blue-50' : ''}`}
                    title="One horizontal and two vertical"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="12" y1="12" x2="12" y2="21" />
                    </svg>
                  </button>
                  
                  {/* Option 2: two horizontal and two vertical */}
                  <button 
                    onClick={() => handleLayoutOptionClick(1)}
                    className={`border p-2 flex items-center justify-center ${activeLayoutOption === 1 ? 'border-blue-500 bg-blue-50' : ''}`}
                    title="Two horizontal and two vertical"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="3" y1="15" x2="21" y2="15" />
                      <line x1="12" y1="15" x2="12" y2="21" />
                    </svg>
                  </button>
                  
                  {/* Option 3: four vertical */}
                  <button 
                    onClick={() => handleLayoutOptionClick(2)}
                    className={`border p-2 flex items-center justify-center ${activeLayoutOption === 2 ? 'border-blue-500 bg-blue-50' : ''}`}
                    title="Four vertical"
                  >
                    <Columns4 size={24} />
                  </button>
                  
                  {/* Option 4: four horizontal */}
                  <button 
                    onClick={() => handleLayoutOptionClick(3)}
                    className={`border p-2 flex items-center justify-center ${activeLayoutOption === 3 ? 'border-blue-500 bg-blue-50' : ''}`}
                    title="Four horizontal"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" />
                      <line x1="3" y1="7.5" x2="21" y2="7.5" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="16.5" x2="21" y2="16.5" />
                    </svg>
                  </button>
                  
                  {/* Option 5: four squares within a square */}
                  <button 
                    onClick={() => handleLayoutOptionClick(4)}
                    className={`border p-2 flex items-center justify-center ${activeLayoutOption === 4 ? 'border-blue-500 bg-blue-50' : ''}`}
                    title="Four squares within a square"
                  >
                    <Grid2x2 size={24} />
                  </button>
                  
                  {/* Option 6: two vertical and two horizontal */}
                  <button 
                    onClick={() => handleLayoutOptionClick(5)}
                    className={`border p-2 flex items-center justify-center ${activeLayoutOption === 5 ? 'border-blue-500 bg-blue-50' : ''}`}
                    title="Two vertical and two horizontal"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" />
                      <line x1="12" y1="3" x2="12" y2="9" />
                      <line x1="3" y1="15" x2="21" y2="15" /> 
                      <line x1="3" y1="9" x2="21" y2="9" />                                                      
                    </svg>
                  </button>
                  
                  {/* Option 7: two vertical and one horizontal */}
                  <button 
                    onClick={() => handleLayoutOptionClick(6)}
                    className={`border p-2 flex items-center justify-center ${activeLayoutOption === 6 ? 'border-blue-500 bg-blue-50' : ''}`}
                    title="Two vertical and one horizontal"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" />
                      <line x1="12" y1="3" x2="12" y2="12" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[200px] max-w-full border rounded"
              >
                <ResizablePanel defaultSize={33}>
                  <div className="p-2 h-full bg-white">
                    <div className="text-sm font-medium mb-1">
                      <EditableText id="revision-1-title">Revision 1</EditableText>
                    </div>
                    <div className="text-xs">
                      <p>
                        <EditableText id="revision-1-content-1">
                          Original text content from revision 1.
                        </EditableText>
                      </p>
                      <p>
                        <EditableText id="revision-1-content-2">
                          This shows the first version.
                        </EditableText>
                      </p>
                    </div>
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={33}>
                  <div className="p-2 h-full bg-white">
                    <div className="text-sm font-medium mb-1">
                      <EditableText id="revision-2-title">Revision 2</EditableText>
                    </div>
                    <div className="text-xs">
                      <p>
                        <EditableText id="revision-2-content-1">
                          Modified text content from revision 2.
                        </EditableText>
                      </p>
                      <p>
                        <EditableText id="revision-2-content-2">
                          This shows the changes made.
                        </EditableText>
                      </p>
                    </div>
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={33}>
                  <div className="p-2 h-full bg-white">
                    <div className="text-sm font-medium mb-1">
                      <EditableText id="revision-3-title">Revision 3</EditableText>
                    </div>
                    <div className="text-xs">
                      <p>
                        <EditableText id="revision-3-content-1">
                          Latest text content from revision 3.
                        </EditableText>
                      </p>
                      <p>
                        <EditableText id="revision-3-content-2">
                          This shows the most recent changes.
                        </EditableText>
                      </p>
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          )}
        </div>
        
        {/* Stories Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            <EditableText id="stories-heading">Stories</EditableText>
          </h2>
          <div>
            <Link to="#" className="text-blue-500 hover:underline mb-4 block">
              <EditableText id="add-story-link">Add story</EditableText>
            </Link>
            
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold mb-2">
                  <EditableText id="authoring-heading">Authoring</EditableText>
                </h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span><EditableText id="text-label">Text</EditableText></span>
                    <span className="text-blue-500">{stats.author.text}</span>
                  </div>
                  <div className="flex justify-between">
                    <span><EditableText id="images-label">Images</EditableText></span>
                    <span className="text-blue-500">{stats.author.images}</span>
                  </div>
                  <div className="flex justify-between">
                    <span><EditableText id="audio-label">Audio</EditableText></span>
                    <span className="text-blue-500">{stats.author.audio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span><EditableText id="video-label">Video</EditableText></span>
                    <span className="text-blue-500">{stats.author.video}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">
                  <EditableText id="consuming-heading">Consuming</EditableText>
                </h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span><EditableText id="text-label">Text</EditableText></span>
                    <span className="text-blue-500">{stats.consumer.text}</span>
                  </div>
                  <div className="flex justify-between">
                    <span><EditableText id="images-label">Images</EditableText></span>
                    <span className="text-blue-500">{stats.consumer.images}</span>
                  </div>
                  <div className="flex justify-between">
                    <span><EditableText id="audio-label">Audio</EditableText></span>
                    <span className="text-blue-500">{stats.consumer.audio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span><EditableText id="video-label">Video</EditableText></span>
                    <span className="text-blue-500">{stats.consumer.video}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">
                  <EditableText id="producing-heading">Producing</EditableText>
                </h3>
                <div className="flex justify-between">
                  <span>
                    <EditableText id="story-label">Story</EditableText>
                  </span>
                  <span className="text-blue-500">{stats.producer.story}</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">
                  <EditableText id="community-heading">Community</EditableText>
                </h3>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">
                    <EditableText id="contributing-heading">Contributing</EditableText>
                  </h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>
                        <EditableText id="text-label">Text</EditableText>
                      </span>
                      <span className="text-blue-500">{stats.community.contributing.text}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        <EditableText id="images-label">Images</EditableText>
                      </span>
                      <span className="text-blue-500">{stats.community.contributing.images}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        <EditableText id="audio-label">Audio</EditableText>
                      </span>
                      <span className="text-blue-500">{stats.community.contributing.audio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        <EditableText id="video-label">Video</EditableText>
                      </span>
                      <span className="text-blue-500">{stats.community.contributing.video}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>
                        <EditableText id="feedback-label">Sent feedback</EditableText>
                      </span>
                      <span className="text-blue-500">{stats.community.sentFeedback}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        <EditableText id="suggested-features-label">Suggested features</EditableText>
                      </span>
                      <span className="text-blue-500">{stats.community.suggestedFeatures}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        <EditableText id="submitted-bug-reports-label">Submitted bug reports</EditableText>
                      </span>
                      <span className="text-blue-500">{stats.community.submittedBugReports}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        <EditableText id="contact-requests-label">Contact requests</EditableText>
                      </span>
                      <span className="text-blue-500">{stats.community.contactRequests}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contributions Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            <EditableText id="contributions-heading">Contributions</EditableText>
          </h2>
          
          <Tabs defaultValue="total">
            <TabsList className="mb-4">
              <TabsTrigger value="total">
                <EditableText id="total-tab">total</EditableText>
              </TabsTrigger>
              <TabsTrigger value="approved">
                <EditableText id="approved-tab">approved</EditableText>
              </TabsTrigger>
              <TabsTrigger value="denied">
                <EditableText id="denied-tab">denied</EditableText>
              </TabsTrigger>
              <TabsTrigger value="undecided">
                <EditableText id="undecided-tab">undecided</EditableText>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="total" className="space-y-4">
              {contributions.map((contribution, index) => (
                <div key={index} className="border-b pb-4">
                  <div className="flex items-start mb-1">
                    <span className="font-semibold text-gray-600 mr-2">{index + 1}.</span>
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-x-2 mb-1">
                        <Link to="#" className="text-blue-500 hover:underline">
                          {contribution.storyTitle}
                        </Link>
                        <Link to="#" className="text-blue-500 hover:underline">
                          {contribution.chapterName}
                        </Link>
                        <span className="text-gray-500">
                          {contribution.date} {contribution.time}
                        </span>
                        <span className="text-gray-500">
                          {contribution.words} words
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <span className="text-gray-500">
                          <EditableText id={`got-likes-${index}`}>got: {contribution.likes} likes</EditableText>
                        </span>
                        <span className="text-blue-500 hover:underline cursor-pointer">
                          <EditableText id={`jump-to-${index}`}>jump to contribution</EditableText>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="approved">
              <div className="py-4 text-center text-gray-500">
                <EditableText id="no-approved-text">
                  No approved contributions yet
                </EditableText>
              </div>
            </TabsContent>
            
            <TabsContent value="denied">
              <div className="py-4 text-center text-gray-500">
                <EditableText id="no-denied-text">
                  No denied contributions
                </EditableText>
              </div>
            </TabsContent>
            
            <TabsContent value="undecided">
              <div className="py-4 text-center text-gray-500">
                <EditableText id="no-undecided-text">
                  No undecided contributions
                </EditableText>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <CrowdlyFooter />
    </div>
  );
};

export default Profile;
