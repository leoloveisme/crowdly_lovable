
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
  Edit, 
  Info, 
  X, 
  Plus,
  Check,
  ChevronDown,
  Upload
} from "lucide-react";
import { Link } from "react-router-dom";
import CrowdlyHeader from "@/components/CrowdlyHeader";
import CrowdlyFooter from "@/components/CrowdlyFooter";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";

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
    { id: 1, text: "Text 1" },
    { id: 2, text: "Text 2" },
    { id: 3, text: "Text 3" },
  ];

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

  const contributions = [
    { 
      id: 1, 
      storyTitle: "Story title", 
      chapterType: "Chapter", 
      dataType: "Data type", 
      words: "...words", 
      gif: "...gif", 
      lines: "...lines"
    },
    { 
      id: 2, 
      storyTitle: "Story title", 
      chapterType: "Chapter title/edit", 
      dataType: "code line", 
      words: "...words", 
      gif: "...gif", 
      lines: "...lines"
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

  return (
    <div className="min-h-screen flex flex-col">
      <CrowdlyHeader />
      
      <div className="container mx-auto px-4 pt-8 pb-16 flex-grow">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold">Profile <Info className="inline h-5 w-5 text-gray-400" /></h1>
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end">
              <div className="flex items-center mb-1">
                <Checkbox 
                  id="private-profile" 
                  checked={isPrivate} 
                  onCheckedChange={() => setIsPrivate(!isPrivate)} 
                  className="mr-2" 
                />
                <Label htmlFor="private-profile">private</Label>
              </div>
              <div className="flex items-center mb-1">
                <Checkbox 
                  id="can-be-tagged" 
                  checked={canBeTagged} 
                  onCheckedChange={() => setCanBeTagged(!canBeTagged)} 
                  className="mr-2" 
                />
                <Label htmlFor="can-be-tagged">can be tagged any time</Label>
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
              <div className="font-semibold">Upload</div>
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
            <div className="text-xs text-gray-500 mb-2">Can be copied any time</div>
            <div className="text-right mb-4">
              <Button variant="link" size="sm" className="text-blue-500 p-0">
                <Link to="/account-administration">Account administration</Link>
              </Button>
            </div>
            
            <div className="mt-auto mb-2">
              <h2 className="text-xl font-bold mb-2">About</h2>
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
            <h2 className="text-xl font-bold mr-2">Interests/Hobbies</h2>
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
                Please enter your interests comma separated
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
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold mr-2">Revisions</h2>
            <Info className="h-5 w-5 text-gray-400" />
            <span className="ml-4 text-sm text-gray-600">Compare up to 4 revisions</span>
          </div>
          
          <div className="mb-4">
            <Table>
              <TableBody>
                {revisions.map((revision, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium w-10">{revision.id}</TableCell>
                    <TableCell className="text-blue-500">{revision.text}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2}>
                    <div className="flex justify-between items-center">
                      <Button variant="link" size="sm" className="text-blue-500 p-0">
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
        </div>
        
        {/* Layout Options */}
        <div className="mb-8">
          <div className="border p-4 rounded">
            <div className="grid grid-cols-5 gap-2">
              <Button variant="ghost" className="p-2 h-12">≡</Button>
              <Button variant="ghost" className="p-2 h-12">⋮</Button>
              <Button variant="ghost" className="p-2 h-12">⋯</Button>
              <Button variant="ghost" className="p-2 h-12">⬒</Button>
              <Button variant="ghost" className="p-2 h-12">⊞</Button>
            </div>
          </div>
        </div>
        
        {/* Stories Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Stories</h2>
          <div>
            <Link to="#" className="text-blue-500 hover:underline mb-4 block">
              Add story
            </Link>
            
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold mb-2">Authoring</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Text</span>
                    <span className="text-blue-500">{stats.author.text}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Images</span>
                    <span className="text-blue-500">{stats.author.images}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Audio</span>
                    <span className="text-blue-500">{stats.author.audio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Video</span>
                    <span className="text-blue-500">{stats.author.video}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Consuming</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Text</span>
                    <span className="text-blue-500">{stats.consumer.text}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Images</span>
                    <span className="text-blue-500">{stats.consumer.images}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Audio</span>
                    <span className="text-blue-500">{stats.consumer.audio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Video</span>
                    <span className="text-blue-500">{stats.consumer.video}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Producing</h3>
                <div className="flex justify-between">
                  <span>Story</span>
                  <span className="text-blue-500">{stats.producer.story}</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Community</h3>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Contributing</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Text</span>
                      <span className="text-blue-500">{stats.community.contributing.text}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Images</span>
                      <span className="text-blue-500">{stats.community.contributing.images}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Audio</span>
                      <span className="text-blue-500">{stats.community.contributing.audio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Video</span>
                      <span className="text-blue-500">{stats.community.contributing.video}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Sent feedback</span>
                      <span className="text-blue-500">{stats.community.sentFeedback}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Suggested features</span>
                      <span className="text-blue-500">{stats.community.suggestedFeatures}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Submitted bug reports</span>
                      <span className="text-blue-500">{stats.community.submittedBugReports}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contact requests</span>
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
          <h2 className="text-xl font-bold mb-4">Contributions</h2>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="gifs">Gifs</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
              <TabsTrigger value="unused">Unused</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {contributions.map((contribution, index) => (
                <div key={index} className="border-b pb-4">
                  <div className="flex items-center mb-2">
                    <span className="font-semibold mr-1">{index + 1}.</span>
                    <Link to="#" className="text-blue-500 hover:underline mr-2">
                      {contribution.storyTitle}
                    </Link>
                    <Link to="#" className="text-blue-500 hover:underline">
                      {contribution.chapterType}
                    </Link>
                    <span className="mx-2">•</span>
                    <span>{contribution.dataType}</span>
                    <span className="mx-2">•</span>
                    <span>{contribution.words}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>
                      <span className="mr-2">{contribution.gif}</span>
                      <span className="mx-2">•</span>
                      <span>{contribution.lines}</span>
                    </div>
                    <div className="mt-1">
                      <Link to="#" className="text-blue-500 hover:underline">
                        Share to contributions
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="gifs">
              <p>Gifs content</p>
            </TabsContent>
            
            <TabsContent value="received">
              <p>Received content</p>
            </TabsContent>
            
            <TabsContent value="unused">
              <p>Unused content</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <CrowdlyFooter />
    </div>
  );
};

export default Profile;
