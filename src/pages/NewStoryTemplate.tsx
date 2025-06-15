import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
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
EyeClosed,
EyeOff,  
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Link } from "react-router-dom";
import CrowdlyHeader from "@/components/CrowdlyHeader";
import CrowdlyFooter from "@/components/CrowdlyFooter";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import { useToast } from "@/hooks/use-toast";
import EditableText from "@/components/EditableText";
import ChapterEditor from "@/components/ChapterEditor";

const STORY_TITLE_MAIN = "Story of my life";

const NewStoryTemplate = () => {
  const [storyTitleId, setStoryTitleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [chapters, setChapters] = useState<any[]>([]);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [addChapterMode, setAddChapterMode] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newChapterParagraphs, setNewChapterParagraphs] = useState<string[]>([]);
  const [mainTitle, setMainTitle] = useState(STORY_TITLE_MAIN);
  const [subtitle, setSubtitle] = useState("");
  const [intro, setIntro] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [savingTitle, setSavingTitle] = useState(false);
  const [storyTitleRevisions, setStoryTitleRevisions] = useState<any[]>([]);

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
    setSettingsOpen(!settingsOpen);
    toast({
      title: settingsOpen ? "Settings closed" : "Settings opened",
      description: settingsOpen ? `Settings for ${section} closed` : `Settings for ${section} opened`,
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

  // Fetch story title revisions
  const fetchStoryTitleRevisions = async (storyTitleId: string) => {
    const { data, error } = await supabase
      .from("story_title_revisions")
      .select("*")
      .eq("story_title_id", storyTitleId)
      .order("revision_number", { ascending: true });
    if (!error && data) setStoryTitleRevisions(data);
  };

  // On mount: create or fetch story, insert initial revision if just created
  useEffect(() => {
    const fetchOrCreateStoryTitle = async () => {
      setLoading(true);
      let { data: storyRow, error } = await supabase
        .from("story_title")
        .select()
        .eq("title", STORY_TITLE_MAIN)
        .maybeSingle();
      if (error) {
        toast({
          title: "DB Error",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      if (!storyRow) {
        // Insert new story title and insert initial revision right after
        const { data: inserted, error: insertErr } = await supabase
          .from("story_title")
          .insert({ title: STORY_TITLE_MAIN })
          .select()
          .maybeSingle();
        if (insertErr) {
          toast({
            title: "Failed to create story",
            description: insertErr.message,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        storyRow = inserted;
        // Insert initial revision entry for this story
        await supabase.from("story_title_revisions").insert({
          story_title_id: storyRow.story_title_id,
          prev_title: null,
          new_title: storyRow.title,
          created_by: null, // set to user.id if available
          revision_number: 1,
          revision_reason: "Initial creation",
          language: "en"
        });
      }
      setStoryTitleId(storyRow.story_title_id);
      setMainTitle(storyRow.title);
      setLoading(false);
      if (storyRow.story_title_id) {
        fetchStoryTitleRevisions(storyRow.story_title_id);
      }
    };
    fetchOrCreateStoryTitle();
  }, []);

  // On storyTitleId change, fetch revisions
  useEffect(() => {
    if (storyTitleId) fetchStoryTitleRevisions(storyTitleId);
  }, [storyTitleId]);

  // CRUD: Load All Chapters
  useEffect(() => {
    const fetchChapters = async () => {
      if (!storyTitleId) return;
      setChaptersLoading(true);
      const { data, error } = await supabase
        .from("stories")
        .select()
        .eq("story_title_id", storyTitleId)
        .order("created_at", { ascending: true });
      if (error) {
        toast({
          title: "Failed to fetch chapters",
          description: error.message,
          variant: "destructive",
        });
        setChaptersLoading(false);
        return;
      }
      setChapters(data || []);
      setChaptersLoading(false);
    };
    fetchChapters();
  }, [storyTitleId]);

  // CRUD: Add Chapter
  const handleCreateChapter = async (data: { chapter_title: string; paragraphs: string[] }) => {
    if (!storyTitleId) return;
    const { error } = await supabase.from("stories").insert({
      story_title_id: storyTitleId,
      chapter_title: data.chapter_title,
      paragraphs: data.paragraphs,
    });
    if (error) {
      toast({
        title: "Failed to add chapter",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Chapter added!" });
    // reload
    const { data: updated } = await supabase
      .from("stories")
      .select()
      .eq("story_title_id", storyTitleId)
      .order("created_at", { ascending: true });
    setChapters(updated || []);
  };

  // CRUD: Update Chapter (fix type: return void instead of boolean)
  const handleUpdateChapter = async (
    chapter_id: string,
    patch: { chapter_title?: string; paragraphs?: string[] }
  ): Promise<void> => {
    const { error } = await supabase
      .from("stories")
      .update(patch)
      .eq("chapter_id", chapter_id);
    if (error) {
      toast({
        title: "Failed to update chapter",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Chapter updated!" });
    // reload
    const { data: updated } = await supabase
      .from("stories")
      .select()
      .eq("story_title_id", storyTitleId)
      .order("created_at", { ascending: true });
    setChapters(updated || []);
  };

  // CRUD: Delete Chapter
  const handleDeleteChapter = async (chapter_id: string) => {
    const { error } = await supabase
      .from("stories")
      .delete()
      .eq("chapter_id", chapter_id);
    if (error) {
      toast({
        title: "Failed to delete chapter",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Chapter deleted!" });
    // reload
    const { data: updated } = await supabase
      .from("stories")
      .select()
      .eq("story_title_id", storyTitleId)
      .order("created_at", { ascending: true });
    setChapters(updated || []);
  };

  const handleUpdateStoryTitle = async (updatedTitle: string) => {
    if (!storyTitleId || !updatedTitle.trim()) return;
    setSavingTitle(true);
    const prevTitle = mainTitle;
    const { error } = await supabase
      .from("story_title")
      .update({ title: updatedTitle })
      .eq("story_title_id", storyTitleId);
    setSavingTitle(false);
    if (error) {
      toast({
        title: "Failed to update title",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    setMainTitle(updatedTitle);
    toast({ title: "Title updated!" });
    // Fetch current max revision_number
    let nextRevision = 1;
    const { data: prevRevs } = await supabase
      .from("story_title_revisions")
      .select("revision_number")
      .eq("story_title_id", storyTitleId)
      .order("revision_number", { ascending: false })
      .limit(1);
    if (prevRevs && prevRevs.length > 0) {
      nextRevision = prevRevs[0].revision_number + 1;
    }
    // Insert new revision record
    await supabase.from("story_title_revisions").insert({
      story_title_id: storyTitleId,
      prev_title: prevTitle,
      new_title: updatedTitle,
      created_by: null, // set to user.id if available
      revision_number: nextRevision,
      revision_reason: "Manual update",
      language: "en"
    });
    fetchStoryTitleRevisions(storyTitleId);
    // Optionally, redirect or update navigation
    navigate(`/story/${storyTitleId}`, { replace: true });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-32">Loading story...</div>;
  }

  return (
    
      
        
          
            
              
                <CrowdlyHeader />
              
            
          
          
            
              
                
                  
                    
                      
                        
                          
                            
                              
                                <Button variant="ghost" size="icon">
                                  <Settings className="h-5 w-5" onClick={() => handleSettingsClick('story')} />
                                </Button>
                              
                            
                            
                              
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-5 w-5" onClick={() => handleEyeClick('story')} />
                                </Button>
                              
                            
                            
                              
                                <Dialog>
                                  
                                    <HelpCircle className="h-5 w-5" />
                                  
                                  
                                    
                                      How to use this template
                                    
                                    
                                      This template is designed to help you create a new story.
                                    
                                  
                                </Dialog>
                              
                            
                          
                        
                      
                    
                  
                
              
            
          

          
            
              
                
                  
                    
                      
                        
                          
                            
                              
                                
                                  {editingTitle ? (
                                    
                                      
                                        <Input
                                          type="text"
                                          value={newTitle}
                                          onChange={(e) => setNewTitle(e.target.value)}
                                          onBlur={() => {
                                            setEditingTitle(false);
                                            setNewTitle(mainTitle);
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                              handleUpdateStoryTitle(newTitle);
                                              setEditingTitle(false);
                                            } else if (e.key === 'Escape') {
                                              setEditingTitle(false);
                                              setNewTitle(mainTitle);
                                            }
                                          }}
                                          placeholder="Enter new title"
                                        />
                                      
                                      
                                        
                                          {savingTitle ? "Saving..." : "Save"}
                                        
                                      
                                    
                                  ) : (
                                    
                                      
                                        {mainTitle}
                                      
                                      
                                        
                                          
                                            
                                              <Edit className="h-4 w-4 mr-2" />
                                            
                                          
                                        
                                      
                                    
                                  )}
                                
                              
                            
                            
                              
                                
                                  
                                    
                                      
                                        
                                          
                                            
                                              
                                                Visibility
                                              
                                              
                                                Control who can see your story
                                              
                                            
                                          
                                          
                                            
                                              
                                                Contributors
                                              
                                              
                                                Manage who can contribute to your story
                                              
                                            
                                          
                                          
                                            
                                              
                                                Revisions
                                              
                                              
                                                View and compare previous versions of your story
                                              
                                            
                                          
                                          
                                            
                                              
                                                Layout Options
                                              
                                              
                                                Customize the layout of your story
                                              
                                            
                                          
                                          
                                            
                                              
                                                Branches
                                              
                                              
                                                Create and manage different versions of your story
                                              
                                            
                                          
                                        
                                      
                                    
                                  
                                
                              
                            
                          
                        
                      
                    
                  
                
              
            

            
              
                
                  
                    
                      
                        
                          
                            
                              
                                Visibility
                              
                            
                            
                              
                                Control who can see your story
                              
                            
                          
                        
                      
                    
                  
                
              
            

            
              
                
                  
                    
                      
                        
                          
                            
                              
                                Contributors
                              
                            
                            
                              
                                Manage who can contribute to your story
                              
                            
                          
                        
                      
                    
                  
                
              
            

            
              
                
                  
                    
                      
                        
                          
                            
                              
                                Revisions
                              
                            
                            
                              
                                View and compare previous versions of your story
                              
                            
                          
                        
                      
                    
                  
                
              
            

            
              
                
                  
                    
                      
                        
                          
                            
                              
                                Layout Options
                              
                            
                            
                              
                                Customize the layout of your story
                              
                            
                          
                        
                      
                    
                  
                
              
            

            
              
                
                  
                    
                      
                        
                          
                            
                              
                                Branches
                              
                            
                            
                              
                                Create and manage different versions of your story
                              
                            
                          
                        
                      
                    
                  
                
              
            
          
        

        
          
            
              
                
                  
                    
                      
                        
                          
                            
                              
                                Visibility
                              
                            
                            
                              
                                
                                  
                                    
                                      Public
                                    
                                    
                                      Anyone can view this story
                                    
                                  
                                
                              
                            
                            
                              
                                
                                  
                                    
                                      Private
                                    
                                    
                                      Only invited contributors can view this story
                                    
                                  
                                
                              
                            
                          
                        
                      
                    
                  
                
              
            

            
              
                
                  
                    
                      
                        
                          
                            
                              
                                Contributors
                              
                            
                            
                              
                                
                                  
                                    
                                      Add Contributor
                                    
                                  
                                
                              
                            
                            
                              
                                
                                  
                                    
                                      Contributor List
                                    
                                  
                                
                              
                            
                          
                        
                      
                    
                  
                
              
            

            
              
                
                  
                    
                      
                        
                          
                            
                              
                                Revisions
                              
                            
                            
                              
                                
                                  
                                    
                                      Compare Revisions
                                    
                                  
                                
                              
                            
                            
                              
                                
                                  
                                    
                                      Revision History
                                    
                                  
                                
                              
                            
                          
                        
                      
                    
                  
                
              
            

            
              
                
                  
                    
                      
                        
                          
                            
                              
                                Layout Options
                              
                            
                            
                              
                                
                                  
                                    
                                      Select Layout
                                    
                                  
                                
                              
                            
                            
                              
                                
                                  
                                    
                                      Layout Preview
                                    
                                  
                                
                              
                            
                          
                        
                      
                    
                  
                
              
            

            
              
                
                  
                    
                      
                        
                          
                            
                              
                                Branches
                              
                            
                            
                              
                                
                                  
                                    
                                      Create Branch
                                    
                                  
                                
                              
                            
                            
                              
                                
                                  
                                    
                                      Branch List
                                    
                                  
                                
                              
                            
                          
                        
                      
                    
                  
                
              
            
          
        
      

      
        
          
            
              
                
                  
                    
                      
                        
                          
                            
                              
                                Public
                              
                            
                            
                              
                                Anyone can view this story
                              
                            
                          
                        
                      
                    
                  
                
              
            

            
              
                
                  
                    
                      
                        
                          
                            
                              
                                Private
                              
                            
                            
                              
                                Only invited contributors can view this story
                              
                            
                          
                        
                      
                    
                  
                
              
            
          
        

        
          
            
              
                
                  
                    
                      
                        
                          
                            
                              
                                Add Contributor
                              
                            
                            
                              
                                
                                  
                                    
                                      Search for a user
                                    
                                  
                                
                              
                            
                            
                              
                                
                                  
                                    
                                      Invite
                                    
                                  
                                
                              
                            
                          
                        
                      
                    
                  
                
              
            

            
              
                
                  
                    
                      
                        
                          
                            
                              
                                Contributor List
                              
                            
                            
                              
                                
                                  
                                    
                                      User
                                    
                                  
                                
                              
                            
                            
                              
                                
                                  
                                    
                                      Role
                                    
                                  
                                
                              
                            
                            
                              
                                
                                  
                                    
                                      Actions
                                    
                                  
                                
                              
                            
                          
                        
                      
                    
                  
                
              
            
          
        

        
          
            
              
                
                  
                    
                      
                        
                          
                            
                              
                                Compare Revisions
                              
                            
                            
                              
                                
                                  
                                    
                                      Select Revisions
                                    
                                  
                                
                              
                            
                            
                              
                                
                                  
                                    
                                      Compare
                                    
                                  
                                
                              
                            
                          
                        
                      
                    
                  
                
              
            

            
              
                
                  
                    
                      
                        
                          
                            
                              
                                Revision History
                              
                            
                            
                              
                                
                                  
                                    
                                      Revision
                                    
                                  
                                
                              
                            
                            
                              
                                
                                  
                                    
                                      Date
                                    
                                  
                                
                              
                            
                            
                              
                                
                                  
                                    
                                      Author
                                    
                                  
                                
                              
                            
                            
                              
                                
                                  
                                    
                                      Actions
                                    
                                  
                                
                              
                            
                          
                        
                      
                    
                  
                
              
            
          
        

        
          
            
              
                
                  
                    
                      
                        
                          
                            
                              
                                Select Layout
                              
                            
                            
                              
                                
                                  
                                    
                                      Layout 1
                                    
                                  
                                
                              
                            
                            
                              
                                
                                  
                                    
                                      Layout 2
                                    
                                  
                                
                              
                            
                            
                              
                                
                                  
                                    
                                      Layout 3
                                    
                                  
                                
                              
                            
                          
                        
                      
                    
                  
                
              
            

            
              
                
                  
                    
                      
                        
                          
                            
                              
                                Layout Preview
                              
                            
                            
                              
                                
                                  
                                    
                                      Preview
                                    
                                  
                                
                              
                            
                          
                        
                      
                    
                  
                
              
            
          
        

        
          
            
              
                
                  
                    
                      
                        
                          
                            
                              
                                Create Branch
                              
                            
                            
                              
                                
                                  
                                    
                                      Branch Name
                                    
                                  
                                
                              
                            
                            
                              
                                
                                  
                                    
                                      Create
                                    
                                  
                                
                              
                            
                          
                        
                      
                    
                  
                
              
            

            
              
                
                  
                    
                      
                        
                          
                            
                              
                                Branch List
                              
                            
                            
                              
                                
                                  
                                    
                                      Name
                                    
                                  
                                
                              
                            
                            
                              
                                
                                  
                                    
                                      Created At
                                    
                                  
                                
                              
                            
                            
                              
                                
                                  
                                    
                                      Actions
                                    
                                  
                                
                              
                            
                          
                        
                      
                    
                  
                
              
            
          
        
      

      
        
          
            
              
                
                  
                    
                      
                        
                          
                            
                              
                                
                                  
                                    
                                      Chapter Title
                                    
                                  
                                
                              
                            
                            
                              
                                
                                  
                                    
                                      Chapter Content
                                    
                                  
                                
                              
                            
                          
                        
                      
                    
                  
                
              
            
          
        

        
          
            
              
                
                  
                    
                      
                        
                          
                            
                              
                                
                                  
                                    
                                      Add Chapter
                                    
                                  
                                
                              
                            
                          
                        
                      
                    
                  
                
              
            
          
        

        
          
            
              
                
                  
                    
                      
                        
                          
                            
                              
                                
                                  
                                    
                                      Chapter List
                                    
                                  
                                
                              
                            
                          
                        
                      
                    
                  
                
              
            
          
        
      

      
        
          
            
              
                
                  
                    
                      
                        
                          
                            
                              
                                
                                  
                                    
                                      Chapter Title
                                    
                                  
                                
                              
                            
                            
                              
                                
                                  
                                    
                                      Chapter Content
                                    
                                  
                                
                              
                            
                          
                        
                      
                    
                  
                
              
            
          
        

        
          
            
              
                
                  
                    
                      
                        
                          
                            
                              
                                
                                  
                                    
                                      Add Chapter
                                    
                                  
                                
                              
                            
                          
                        
                      
                    
                  
                
              
            
          
        

        
          
            
              
                
                  
                    
                      
                        
                          
                            
                              
                                
                                  
                                    
                                      Chapter List
                                    
                                  
                                
                              
                            
                          
                        
                      
                    
                  
                
              
            
          
        
      
    
  );
};

export default NewStoryTemplate;
