
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
import { Tabs, TabsList, TabsContent } from "@/components/ui/tabs";
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
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card";
import {
  Settings,
  Edit, 
  X, 
  ChevronDown,
  Plus,
  Check,
  Upload,
  Grid2x2,
  Columns4,
  PencilLine,
  User,
  Globe,
  Users,
  FileText,
  Image,
  AudioLines,
  Video,
  BookOpen,
  MessageSquare,
  Send,
  Award,
  Star,
  Eye,
  EyeOff,
  Info,
  HelpCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import CrowdlyHeader from "@/components/CrowdlyHeader";
import CrowdlyFooter from "@/components/CrowdlyFooter";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import EditableText from "@/components/EditableText";
import EditableBio from "@/components/EditableBio";
import { useToast } from "@/hooks/use-toast";
import ResponsiveTabsTrigger from "@/components/ResponsiveTabsTrigger";
import { useIsMobile } from "@/hooks/use-mobile";

const Profile = () => {
  // Original state
  const [first_name, setFirstName] = useState("Max");
  const [last_name, setLastName] = useState("Riprin");
  const [nickname, setNickname] = useState("");
  const [about, setAbout] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [canBeTagged, setCanBeTagged] = useState(true);
  const [anyoneCanEdit, setAnyoneCanEdit] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [visibilityOption, setVisibilityOption] = useState("public");
  const [editField, setEditField] = useState<string | null>(null);
  const [tempFieldValue, setTempFieldValue] = useState("");
  const [activeTab, setActiveTab] = useState("author");
  
  // Add new state for settings popover
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Add new state for preview mode
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();
  
  // For responsive design
  const isMobile = useIsMobile();
  
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

  // Add contribution filter state
  const [contributionFilter, setContributionFilter] = useState("total");

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
      likes: 3,
      status: "approved"
    },
    { 
      id: 2, 
      storyTitle: "Another story", 
      chapterName: "Chapter 5",
      date: "2023-05-03",
      time: "14:15",
      words: 320,
      likes: 7,
      status: "denied"
    },
    { 
      id: 3, 
      storyTitle: "Epic Journey", 
      chapterName: "Introduction",
      date: "2023-05-05",
      time: "09:45",
      words: 480,
      likes: 12,
      status: "undecided"
    }
  ];

  // Toggle preview mode function
  const togglePreviewMode = () => {
    const newPreviewMode = !previewMode;
    setPreviewMode(newPreviewMode);
    // Close the settings popover when entering preview mode
    if (newPreviewMode) {
      setIsSettingsOpen(false);
    }
    toast({
      title: newPreviewMode ? "Preview Mode Activated" : "Edit Mode Activated",
      description: newPreviewMode ? "Viewing profile as others see it" : "You can now edit your profile",
      duration: 2000,
    });
  };

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
  
  const handleBioSave = (newBio: string) => {
    setBio(newBio);
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

  // Functions for profile editing
  const startEditing = (field: string, value: string) => {
    if (previewMode) return; // Prevent editing in preview mode
    setEditField(field);
    setTempFieldValue(value);
  };
  
  const saveField = () => {
    if (editField === 'first_name') {
      setFirstName(tempFieldValue);
    } else if (editField === 'last_name') {
      setLastName(tempFieldValue.startsWith('@') ? tempFieldValue : `@${tempFieldValue}`);
    } else if (editField === 'nickname') {
      setNickname(tempFieldValue);
    }
    setEditField(null);
  };
  
  const cancelEditing = () => {
    setEditField(null);
  };

  // Filter contributions based on selected filter
  const filteredContributions = contributions.filter(contribution => {
    if (contributionFilter === "total") return true;
    return contribution.status === contributionFilter;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <CrowdlyHeader />
      
      <div className="container mx-auto px-4 pt-8 pb-16 flex-grow">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold">
            <EditableText id="profile-title">Profile</EditableText> 
            {!previewMode && (
              <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-4" align="start">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">
                      <EditableText id="visibility-popup-label">Visibility</EditableText>
                    </h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 -mt-1 -mr-1"
                      onClick={() => setIsSettingsOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                          <Info className="h-4 w-4" />
                          <EditableText id="can-be-changed-text-popup">Can be changed any time</EditableText>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          <EditableText id="visibility-tooltip-popup">
                            You can change your profile visibility at any time
                          </EditableText>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <RadioGroup 
                    value={visibilityOption} 
                    onValueChange={setVisibilityOption}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="public-popup" />
                      <Label htmlFor="public-popup" className="flex items-center gap-2 cursor-pointer">
                        <Globe className="h-4 w-4 text-purple-600" />
                        <EditableText id="public-option-popup">Public</EditableText>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="private" id="private-popup" />
                      <Label htmlFor="private-popup" className="flex items-center gap-2 cursor-pointer">
                        <User className="h-4 w-4 text-purple-600" />
                        <EditableText id="private-option-popup">Private</EditableText>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="friends" id="friends-popup" />
                      <Label htmlFor="friends-popup" className="flex items-center gap-2 cursor-pointer">
                        <Users className="h-4 w-4 text-purple-600" />
                        <EditableText id="friends-option-popup">Friends only</EditableText>
                      </Label>
                    </div>
                  </RadioGroup>
                </PopoverContent>
              </Popover>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className={`p-1 ${previewMode ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
              onClick={togglePreviewMode}
            >
              {previewMode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </Button>
          </h1>
        </div>
        
        {/* Profile Information Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold mr-2">
              <EditableText id="profile-information-heading">Profile information</EditableText>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left column for profile picture */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <Avatar className="h-32 w-32 border-2 border-gray-200">
                  {profileImage ? (
                    <AvatarImage src={profileImage} alt={first_name} />
                  ) : (
                    <AvatarFallback className="bg-purple-100 text-purple-600 text-4xl">
                      <User className="h-16 w-16" />
                    </AvatarFallback>
                  )}
                </Avatar>
                {!previewMode && (
                  <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-purple-600 hover:bg-purple-700"
                        onClick={() => setIsUploadDialogOpen(true)}
                      >
                        <PencilLine className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <ProfilePictureUpload onImageChange={handleProfileImageChange} />
                  </Dialog>
                )}
              </div>
              {!previewMode && (
                <Button
                  variant="outline"
                  className="text-purple-600 border-purple-600 hover:bg-purple-50"
                  onClick={() => setIsUploadDialogOpen(true)}
                >
                  <EditableText id="change-photo-text">Change photo</EditableText>
                </Button>
              )}
            </div>
            
            {/* Right column for profile details */}
            <div className="md:col-span-2 space-y-6">
              {/* Profile fields */}
              <div className="space-y-4">
                {/* Name field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-500">
                      <EditableText id="first-name">First name</EditableText>
                    </Label>
                    {!previewMode && editField === 'first_name' ? (
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" onClick={cancelEditing} className="h-6 w-6 p-0">
                          <X className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={saveField} className="h-6 w-6 p-0 text-green-600">
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : !previewMode ? (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => startEditing('first_name', first_name)}
                        className="h-6 p-0 text-purple-600 hover:text-purple-800 hover:bg-transparent"
                      >
                        <EditableText id="edit-button">Edit</EditableText>
                      </Button>
                    ) : null}
                  </div>
                  {!previewMode && editField === 'first_name' ? (
                    <Input 
                      value={tempFieldValue}
                      onChange={(e) => setTempFieldValue(e.target.value)}
                      className="mt-1"
                      autoFocus
                    />
                  ) : (
                    <div className="font-medium">{first_name}</div>
                  )}
                </div>
                
                {/* Last name field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-500">
                      <EditableText id="last-name">Last name</EditableText>
                    </Label>
                    {!previewMode && editField === 'last_name' ? (
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" onClick={cancelEditing} className="h-6 w-6 p-0">
                          <X className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={saveField} className="h-6 w-6 p-0 text-green-600">
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : !previewMode ? (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => startEditing('last_name', last_name)}
                        className="h-6 p-0 text-purple-600 hover:text-purple-800 hover:bg-transparent"
                      >
                        <EditableText id="edit-button">Edit</EditableText>
                      </Button>
                    ) : null}
                  </div>
                  {!previewMode && editField === 'last_name' ? (
                    <Input 
                      value={tempFieldValue}
                      onChange={(e) => setTempFieldValue(e.target.value)}
                      className="mt-1"
                      autoFocus
                    />
                  ) : (
                    <div className="font-medium text-gray-800">{last_name}</div>
                  )}
                </div>
                
                {/* Nickname field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-500">
                      <EditableText id="nickname-label">Nickname</EditableText>
                    </Label>
                    {!previewMode && editField === 'nickname' ? (
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" onClick={cancelEditing} className="h-6 w-6 p-0">
                          <X className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={saveField} className="h-6 w-6 p-0 text-green-600">
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : !previewMode ? (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => startEditing('nickname', nickname)}
                        className="h-6 p-0 text-purple-600 hover:text-purple-800 hover:bg-transparent"
                      >
                        <EditableText id="edit-button">Edit</EditableText>
                      </Button>
                    ) : null}
                  </div>
                  {!previewMode && editField === 'nickname' ? (
                    <Input 
                      value={tempFieldValue}
                      onChange={(e) => setTempFieldValue(e.target.value)}
                      className="mt-1"
                      autoFocus
                    />
                  ) : (
                    <div className="font-medium text-gray-800">
                      {nickname ? nickname : (
                        <span className="text-gray-400 italic">
                          <EditableText id="no-nickname-text">No nickname set</EditableText>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Remove inline visibility settings as they are now in the popover */}
              {previewMode && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    {visibilityOption === "public" && <Globe className="h-4 w-4 text-purple-600" />}
                    {visibilityOption === "private" && <User className="h-4 w-4 text-purple-600" />}
                    {visibilityOption === "friends" && <Users className="h-4 w-4 text-purple-600" />}
                    <span className="text-sm">
                      {visibilityOption === "public" && "Public profile"}
                      {visibilityOption === "private" && "Private profile"}
                      {visibilityOption === "friends" && "Friends only profile"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-xl text-gray-600 mb-4">
            <EditableText id="main-subtitle">
              About
            </EditableText>
          </p>

          {/* Bio section */}
          <EditableBio 
            initialValue={bio} 
            isPreviewMode={previewMode} 
            onSave={handleBioSave}
            className="mb-8"
          />
        </div>
        
        {/* Interests/Hobbies Section */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-bold mr-2">
              <EditableText id="interests-heading">Interests/Hobbies</EditableText>
            </h2>
            <Info className="h-5 w-5 text-gray-400" />            
          </div>
          
          {!previewMode && (
            <div className="mb-3">
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
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            {interests.map((interest, index) => (
              <div key={index} className="bg-gray-100 rounded-full px-3 py-1 flex items-center gap-1">
                <span>{interest}</span>
                {!previewMode && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => handleRemoveInterest(interest)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Stats and activity tabs */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            <EditableText id="stats-heading">Stats & Activity</EditableText>
          </h2>
          
          <Tabs defaultValue="author" className="w-full">
            <TabsList className="bg-gray-100 p-1 mb-6 w-full md:w-auto overflow-x-auto flex">
              <ResponsiveTabsTrigger
                value="author"
                icon={<FileText className="h-5 w-5" />}
                text="Author"
                onClick={() => setActiveTab("author")}
              />
              <ResponsiveTabsTrigger
                value="consumer"
                icon={<BookOpen className="h-5 w-5" />}
                text="Consumer"
                onClick={() => setActiveTab("consumer")}
              />
              <ResponsiveTabsTrigger
                value="producer"
                icon={<Award className="h-5 w-5" />}
                text="Producer"
                onClick={() => setActiveTab("producer")}
              />
              <ResponsiveTabsTrigger
                value="community"
                icon={<Users className="h-5 w-5" />}
                text="Community"
                onClick={() => setActiveTab("community")}
              />
            </TabsList>
            
            {/* Author Tab Content */}
            <TabsContent value="author" className="space-y-4">
              <h3 className="text-lg font-semibold">
                <EditableText id="author-contributions">Authoring</EditableText>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{stats.author.text}</p>
                    <p className="text-sm text-muted-foreground">
                      <EditableText id="author-text-count">Text</EditableText>
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{stats.author.images}</p>
                    <p className="text-sm text-muted-foreground">
                      <EditableText id="author-images-count">Images</EditableText>
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{stats.author.audio}</p>
                    <p className="text-sm text-muted-foreground">
                      <EditableText id="author-audio-count">Audio</EditableText>
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{stats.author.video}</p>
                    <p className="text-sm text-muted-foreground">
                      <EditableText id="author-video-count">Video</EditableText>
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <h3 className="text-lg font-semibold mt-6">
                <EditableText id="contributions-heading">Contributions</EditableText>
              </h3>
              
              {/* Add contribution filter buttons */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <HelpCircle className="h-4 w-4 text-gray-400 mr-2" />
                </div>
                <div className="flex space-x-4 text-sm">
                  <button 
                    className={`${contributionFilter === 'total' ? 'text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setContributionFilter('total')}
                  >
                    <EditableText id="filter-total">total</EditableText>
                  </button>
                  <button 
                    className={`${contributionFilter === 'approved' ? 'text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setContributionFilter('approved')}
                  >
                    <EditableText id="filter-approved">approved</EditableText>
                  </button>
                  <button 
                    className={`${contributionFilter === 'denied' ? 'text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setContributionFilter('denied')}
                  >
                    <EditableText id="filter-denied">denied</EditableText>
                  </button>
                  <button 
                    className={`${contributionFilter === 'undecided' ? 'text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setContributionFilter('undecided')}
                  >
                    <EditableText id="filter-undecided">undecided</EditableText>
                  </button>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <EditableText id="story-title-heading">Story Title</EditableText>
                    </TableHead>
                    <TableHead>
                      <EditableText id="chapter-heading">Chapter</EditableText>
                    </TableHead>
                    <TableHead>
                      <EditableText id="date-heading">Date</EditableText>
                    </TableHead>
                    <TableHead>
                      <EditableText id="words-heading">Words</EditableText>
                    </TableHead>
                    <TableHead>
                      <EditableText id="likes-heading">Likes</EditableText>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContributions.map(contribution => (
                    <TableRow key={contribution.id}>
                      <TableCell>{contribution.storyTitle}</TableCell>
                      <TableCell>{contribution.chapterName}</TableCell>
                      <TableCell>{contribution.date}</TableCell>
                      <TableCell>{contribution.words}</TableCell>
                      <TableCell>{contribution.likes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            {/* Consumer Tab Content */}
            <TabsContent value="consumer" className="space-y-4">
              <h3 className="text-lg font-semibold">
                <EditableText id="consumer-stats">Consumer Stats</EditableText>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{stats.consumer.text}</p>
                    <p className="text-sm text-muted-foreground">
                      <EditableText id="consumer-text-count">Text</EditableText>
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{stats.consumer.images}</p>
                    <p className="text-sm text-muted-foreground">
                      <EditableText id="consumer-images-count">Images</EditableText>
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{stats.consumer.audio}</p>
                    <p className="text-sm text-muted-foreground">
                      <EditableText id="consumer-audio-count">Audio</EditableText>
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{stats.consumer.video}</p>
                    <p className="text-sm text-muted-foreground">
                      <EditableText id="consumer-video-count">Video</EditableText>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Producer Tab Content */}
            <TabsContent value="producer" className="space-y-4">
              <h3 className="text-lg font-semibold">
                <EditableText id="producer-stats">Producer Stats</EditableText>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{stats.producer.story}</p>
                    <p className="text-sm text-muted-foreground">
                      <EditableText id="producer-story-count">Stories</EditableText>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Community Tab Content */}
            <TabsContent value="community" className="space-y-4">
              <h3 className="text-lg font-semibold">
                <EditableText id="community-contributing">Contributing</EditableText>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{stats.community.contributing.text}</p>
                    <p className="text-sm text-muted-foreground">
                      <EditableText id="community-text-count">Text</EditableText>
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{stats.community.contributing.images}</p>
                    <p className="text-sm text-muted-foreground">
                      <EditableText id="community-images-count">Images</EditableText>
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{stats.community.contributing.audio}</p>
                    <p className="text-sm text-muted-foreground">
                      <EditableText id="community-audio-count">Audio</EditableText>
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{stats.community.contributing.video}</p>
                    <p className="text-sm text-muted-foreground">
                      <EditableText id="community-video-count">Video</EditableText>
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <h3 className="text-lg font-semibold mt-6">
                <EditableText id="community-engagement">Community Engagement</EditableText>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{stats.community.sentFeedback}</p>
                    <p className="text-sm text-muted-foreground">
                      <EditableText id="sent-feedback-count">Sent Feedback</EditableText>
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{stats.community.suggestedFeatures}</p>
                    <p className="text-sm text-muted-foreground">
                      <EditableText id="suggested-features-count">Suggested Features</EditableText>
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{stats.community.submittedBugReports}</p>
                    <p className="text-sm text-muted-foreground">
                      <EditableText id="submitted-bug-reports">Submitted Bug Reports</EditableText>
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold">{stats.community.contactRequests}</p>
                    <p className="text-sm text-muted-foreground">
                      <EditableText id="contact-requests-count">Contact Requests</EditableText>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Contributions Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            <EditableText id="contributions-section">Contributions</EditableText>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">
                  <EditableText id="contribution-1-title">Contribution 1</EditableText>
                </h3>
                <span className="text-xs text-muted-foreground">1024 words</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                <EditableText id="contribution-1-description">
                  This is a description of the first contribution. It includes details about what was contributed and when.
                </EditableText>
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-gray-100 rounded-full px-2 py-1">
                  <EditableText id="story-label">Story</EditableText>
                </span>
                <span className="bg-gray-100 rounded-full px-2 py-1">
                  <EditableText id="chapter-label">Chapter 1</EditableText>
                </span>
                <span className="text-muted-foreground ml-auto">
                  <EditableText id="date-1">May 5, 2023</EditableText>
                </span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">
                  <EditableText id="contribution-2-title">Contribution 2</EditableText>
                </h3>
                <span className="text-xs text-muted-foreground">768 words</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                <EditableText id="contribution-2-description">
                  This is a description of the second contribution. It includes details about what was contributed and when.
                </EditableText>
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-gray-100 rounded-full px-2 py-1">
                  <EditableText id="story-2-label">Story</EditableText>
                </span>
                <span className="bg-gray-100 rounded-full px-2 py-1">
                  <EditableText id="chapter-2-label">Chapter 2</EditableText>
                </span>
                <span className="text-muted-foreground ml-auto">
                  <EditableText id="date-2">May 12, 2023</EditableText>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hide editing features in preview mode */}
        {!previewMode && (
          <>
            {/* Revisions Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-blue-500 text-sm hover:underline cursor-pointer">
                  <EditableText id="revisions-heading">Revisions</EditableText>
                </span>
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
                              Additional content from revision 1.
                            </EditableText>
                          </p>
                        </div>
                      </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={67}>
                      <div className="p-2 h-full bg-white">
                        <div className="text-sm font-medium mb-1">
                          <EditableText id="revision-2-title">Revision 2</EditableText>
                        </div>
                        <div className="text-xs">
                          <p>
                            <EditableText id="revision-2-content-1">
                              Updated text content from revision 2.
                            </EditableText>
                          </p>
                          <p>
                            <EditableText id="revision-2-content-2">
                              Additional content from revision 2 with changes highlighted.
                            </EditableText>
                          </p>
                        </div>
                      </div>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </div>
              )}
            </div>
          </>
        )}
      </div>



  <Button variant="outline" size="sm" className="mt-4 w-full">
      <EditableText id="jumpToAccountAdministration">Account Administration</EditableText>
      </Button>

      
      <CrowdlyFooter />
    </div>
  );
};

export default Profile;

