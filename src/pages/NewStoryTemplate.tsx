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
import { 
Settings, 
Eye, 
HelpCircle, 
CircleX, 
LayoutTemplate, 
Heart, 
Columns2, 
Columns3, 
LayoutGrid, 
LayoutList, 
LayoutDashboard 
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
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
import { useToast } from "@/hooks/use-toast";
import EditableText from "@/components/EditableText";



const NewStoryTemplate = () => {
  const [visibilityOpen, setVisibilityOpen] = useState(false);
  const [contributorsOpen, setContributorsOpen] = useState(true);
  const [revisionsOpen, setRevisionsOpen] = useState(true);
  const [layoutOptionsOpen, setLayoutOptionsOpen] = useState(true);
  const [branchesOpen, setBranchesOpen] = useState(true);
  const [isPublished, setIsPublished] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [selectedRevisions, setSelectedRevisions] = useState<number[]>([]);
  const [columnChecked, setColumnChecked] = useState<number[]>([]);
  const [activeLayoutOption, setActiveLayoutOption] = useState<number | null>(null);
  const { toast } = useToast();

  const toggleSection = (section: string) => {
    switch(section) {
      case 'visibility':
        setVisibilityOpen(!visibilityOpen);
        break;
      case 'contributors':
        setContributorsOpen(!contributorsOpen);
        break;
      case 'revisions':
        setRevisionsOpen(!revisionsOpen);
        break;
      case 'layoutOptions':
        setLayoutOptionsOpen(!layoutOptionsOpen);
        break;
      case 'branches':
        setBranchesOpen(!branchesOpen);
        break;
    }
  };

  const togglePublishStatus = () => {
    setIsPublished(!isPublished);
    toast({
      title: isPublished ? "Story unpublished" : "Story published",
      description: isPublished 
        ? "Your story is no longer visible to others" 
        : "Your story is now visible to others",
      duration: 3000,
    });
  };

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

  const toggleColumnCheckbox = (revisionId: number) => {
    setColumnChecked(prev => {
      if (prev.includes(revisionId)) {
        return prev.filter(id => id !== revisionId);
      } else {
        return [...prev, revisionId];
      }
    });
  };
  
  const handleEditClick = (section: string) => {
    toast({
      title: "Edit mode activated",
      description: `You are now editing ${section}`,
      duration: 3000,
    });
  };
  
  const handleSettingsClick = (section: string) => {
    toast({
      title: "Settings opened",
      description: `Settings for ${section} opened`,
      duration: 3000,
    });
  };
  
  const handleEyeClick = (section: string) => {
    toast({
      title: "Preview mode activated",
      description: `Previewing ${section}`,
      duration: 3000,
    });
  };

  const handleLayoutOptionClick = (layoutIndex: number) => {
    setActiveLayoutOption(layoutIndex);
    toast({
      title: "Layout changed",
      description: `Layout option ${layoutIndex + 1} selected`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CrowdlyHeader />
      
      <div className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-8">
          {/* Story Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              <EditableText id="story-title">Sample story</EditableText>
            </h1>
            <h2 className="text-xl">
              <EditableText id="story-subtitle">of your life</EditableText>
            </h2>
          </div>

          {/* Story Actions */}
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <button 
                className="text-blue-500 hover:underline"
                onClick={togglePublishStatus}
              >
                {isPublished ? "unpublish" : "publish"}
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button className="text-blue-500 hover:underline">clone</button>
              <HelpCircle size={14} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1">
              <button className="text-blue-500 hover:underline">delete</button>
              <HelpCircle size={14} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1">
              <button className="text-blue-500 hover:underline">read</button>
              <HelpCircle size={14} className="text-gray-400" />
            </div>
            <button className="text-blue-500 hover:underline">add chapter</button>
          </div>

          {/* Visibility Options */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm">
               <input type="radio" name="visibility" />
                public
              </label>             
              <button onClick={() => toggleSection('visibility')}>
                {visibilityOpen ? <CircleX size={16} /> : <HelpCircle size={16} className="text-gray-400" />}
              </button>
            </div>
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="visibility" />
                invitation only
              </label>
              <HelpCircle size={16} className="text-gray-400" />
            </div>
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="visibility" />
                private
              </label>
              <HelpCircle size={16} className="text-gray-400" />
            </div>
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="visibility" />
                read only
              </label>
              <HelpCircle size={16} className="text-gray-400" />
            </div>
          </div>

          {/* Intro Section */}
          <div className="border-b pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">
                <EditableText id="intro-title">Intro</EditableText>
              </h3>
              <div className="flex gap-2">
                <button onClick={() => handleEditClick("Intro")} className="cursor-pointer hover:text-blue-500">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleSettingsClick("Intro")} className="cursor-pointer hover:text-blue-500">
                  <Settings size={16} />
                </button>
                <button onClick={() => handleEyeClick("Intro")} className="cursor-pointer hover:text-blue-500">
                  <Eye size={16} />
                </button>
                <HelpCircle size={16} />
              </div>
            </div>

            {/* Contributors */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-500 text-sm hover:underline cursor-pointer">contributors</span>
                <div className="flex">
                  <button onClick={() => toggleSection('contributors')}>
                    {contributorsOpen ? <CircleX size={16} /> : <LayoutTemplate size={16} />}
                  </button>
                </div>
              </div>
              
              {contributorsOpen && (
                <div className="bg-white rounded-md shadow-sm border p-4">
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        { name: "soft.melody", value: 550 },
                        { name: "chill_creator", value: 550 },
                        { name: "mister.carluristo", value: 550 }
                      ].map((contributor, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-2 text-blue-500">{contributor.name}</td>
                          <td className="py-2 text-green-500">$ 5</td>
                          <td className="py-2 text-green-500">$ 5</td>
                          <td className="py-2">{contributor.value}</td>
                          <td className="py-2 text-red-500">
                            <button className="hover:underline">delete</button>
                          </td>
                          <td className="py-2 flex items-center">
                            <button className="text-blue-500 hover:underline mr-1">ban</button>
                            <HelpCircle size={14} className="text-gray-400" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="text-red-500">
                <EditableText id="total-story">Total in this story</EditableText>
              </div>
              <div className="text-green-500">
                <EditableText id="approved-story">Approved in this story</EditableText>
              </div>
              <div>
                <EditableText id="total-contributor">Total by the contributor</EditableText>
              </div>
            </div>
          </div>

          {/* Revisions Section */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className="text-blue-500 text-sm hover:underline cursor-pointer">revisions</span>
              <div className="flex">
                <button onClick={() => toggleSection('revisions')}>
                  {revisionsOpen ? <Eye size={16} /> : <LayoutTemplate size={16} />}
                </button>
              </div>
            </div>
            
            {revisionsOpen && (
              <div className="bg-white rounded-md shadow-sm border p-4">
                <table className="w-full text-sm">
                  <tbody>
                    {[1, 2, 3].map((number) => (
                      <tr key={number} className="border-b last:border-0">
                        <td className="py-2 text-center">{number}</td>
                        <td className="py-2 text-blue-500">11:28</td>
                        <td className="py-2 w-8">
                          <Checkbox 
                            id={`revision-${number}`} 
                            checked={columnChecked.includes(number)} 
                            onCheckedChange={() => toggleColumnCheckbox(number)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-2 flex items-center gap-1">
                  <button 
                    className="text-blue-500 text-sm hover:underline"
                    onClick={toggleCompare}
                  >
                    compare
                  </button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle size={14} className="text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>You can compare up to 4 revisions</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                {/* Comparison Container */}
                {compareOpen && (
                  <div className="mt-4 border rounded-md p-2 bg-gray-50">
                    <h4 className="font-medium mb-2">Compare Revisions</h4>
                    
                    {/* Layout options */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium mb-2">7 viewing options:</h5>
                      
                      <div className="grid grid-cols-7 gap-2">
                        {/* Option 1: one horizontal and two vertical - Custom SVG to match screenshot */}
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
                        
                        {/* Option 2: two horizontal and two vertical - Custom SVG to match screenshot */}
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
                        
                        {/* Option 4: four horizontal - Custom SVG to match uploaded image */}
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
                        
                        {/* Option 6: two vertical and two horizontal - Flipped version of option 2 */}
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
                        
                        {/* Option 7: two vertical and one horizontal - Updated to match screenshot */}
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
                      
                      {/* Layout descriptions */}
                      <div className="mt-2 text-xs text-gray-500">
                        <p>1. One horizontal and two vertical (for the case 3 versions were chosen to compare)</p>
                        <p>2. Two horizontal and two vertical (if 4 versions were chosen)</p>
                        <p>3. Four vertical (from one to four chosen)</p>
                        <p>4. Four horizontal (from one to four chosen)</p>
                        <p>5. Four squares within a square</p>
                        <p>6. Two vertical and two horizontal</p>
                        <p>7. Two vertical and one horizontal</p>
                      </div>
                    </div>
                    
                    <ResizablePanelGroup
                      direction="horizontal"
                      className="min-h-[200px] max-w-full border rounded"
                    >
                      <ResizablePanel defaultSize={33}>
                        <div className="p-2 h-full bg-white">
                          <div className="text-sm font-medium mb-1">Revision 1</div>
                          <div className="text-xs">
                            <p>Original text content from revision 1.</p>
                            <p>This shows the first version.</p>
                          </div>
                        </div>
                      </ResizablePanel>
                      
                      <ResizableHandle withHandle />
                      
                      <ResizablePanel defaultSize={33}>
                        <div className="p-2 h-full bg-white">
                          <div className="text-sm font-medium mb-1">Revision 2</div>
                          <div className="text-xs">
                            <p>Modified text content from revision 2.</p>
                            <p>This shows the changes made.</p>
                          </div>
                        </div>
                      </ResizablePanel>
                      
                      <ResizableHandle withHandle />
                      
                      <ResizablePanel defaultSize={33}>
                        <div className="p-2 h-full bg-white">
                          <div className="text-sm font-medium mb-1">Revision 3</div>
                          <div className="text-xs">
                            <p>Latest text content from revision 3.</p>
                            <p>This shows the most recent changes.</p>
                          </div>
                        </div>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  </div>
                )}
              </div>
            )}
          </div>           

           {/* begin of my addition */}


          


            {/*  end of my addition */}

          {/* Branches Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-500 text-sm hover:underline cursor-pointer">branches</span>
              <div className="flex">
                <button onClick={() => toggleSection('branches')}>
                  {branchesOpen ? <CircleX size={16} /> : <LayoutTemplate size={16} />}
                </button>
              </div>
            </div>
            {/* This below is the text from the Intro chapter */} 
            {branchesOpen && (
              <div className="bg-white rounded-md shadow-sm border p-4">
                <div className="text-sm">
                  <p>Some sample text</p>
                  <p>over</p>
                  <p>several line</p>
                </div>
                <div className="flex justify-end gap-2 mt-2 text-xs items-center">
                  <Edit size={14} />
                  <span>5</span>
                  <Heart size={14} />
                  <span>10</span>
                </div>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">
              <EditableText id="comments-title">Comments</EditableText>
            </h3>
            <div className="pl-4 text-sm">
              <p className="mb-1">
                <EditableText id="sample-comment">Some sample comment</EditableText>
              </p>
              <p className="pl-4 text-gray-600">
                <EditableText id="sample-reply">Some reply to the sample comment</EditableText>
              </p>
            </div>
          </div>

          {/* Chapter 1 */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">
                  <EditableText id="chapter1-title">Chapter 1</EditableText>
                </h3>
                <p className="text-lg">
                  <EditableText id="chapter1-subtitle">The day I was conceived</EditableText>
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditClick("Chapter 1")} className="cursor-pointer hover:text-blue-500">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleSettingsClick("Chapter 1")} className="cursor-pointer hover:text-blue-500">
                  <Settings size={16} />
                </button>
                <button onClick={() => handleEyeClick("Chapter 1")} className="cursor-pointer hover:text-blue-500">
                  <Eye size={16} />
                </button>
                <HelpCircle size={16} />
              </div>
            </div>
          </div>

          {/* Chapter 2 */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">
                  <EditableText id="chapter2-title">Chapter 2</EditableText>
                </h3>
                <p className="text-lg">
                  <EditableText id="chapter2-subtitle">The day I was born</EditableText>
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditClick("Chapter 2")} className="cursor-pointer hover:text-blue-500">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleSettingsClick("Chapter 2")} className="cursor-pointer hover:text-blue-500">
                  <Settings size={16} />
                </button>
                <button onClick={() => handleEyeClick("Chapter 2")} className="cursor-pointer hover:text-blue-500">
                  <Eye size={16} />
                </button>
                <HelpCircle size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CrowdlyFooter />
    </div>
  );
};

export default NewStoryTemplate;
