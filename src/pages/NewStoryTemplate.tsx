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
    <>
      <div className="flex flex-col min-h-screen">
        <header>
          <CrowdlyHeader />
        </header>
        
        <main className="flex-1 p-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" onClick={() => handleSettingsClick('story')} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Eye className="h-5 w-5" onClick={() => handleEyeClick('story')} />
                </Button>
                <Dialog>
                  <DialogTrigger>
                    <HelpCircle className="h-5 w-5" />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>How to use this template</DialogTitle>
                    </DialogHeader>
                    <p>This template is designed to help you create a new story.</p>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="container mx-auto mb-8">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    {editingTitle ? (
                      <div className="flex items-center gap-2">
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
                        <Button onClick={() => handleUpdateStoryTitle(newTitle)}>
                          {savingTitle ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CardTitle>{mainTitle}</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => {
                          setEditingTitle(true);
                          setNewTitle(mainTitle);
                        }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">Settings</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Visibility</h4>
                            <p className="text-sm text-muted-foreground">Control who can see your story</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => toggleSection('visibility')}>
                            {visibilityOpen ? <ChevronDown /> : <ChevronDown />}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Contributors</h4>
                            <p className="text-sm text-muted-foreground">Manage who can contribute to your story</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => toggleSection('contributors')}>
                            {contributorsOpen ? <ChevronDown /> : <ChevronDown />}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Revisions</h4>
                            <p className="text-sm text-muted-foreground">View and compare previous versions of your story</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => toggleSection('revisions')}>
                            {revisionsOpen ? <ChevronDown /> : <ChevronDown />}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Layout Options</h4>
                            <p className="text-sm text-muted-foreground">Customize the layout of your story</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => toggleSection('layoutOptions')}>
                            {layoutOptionsOpen ? <ChevronDown /> : <ChevronDown />}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Branches</h4>
                            <p className="text-sm text-muted-foreground">Create and manage different versions of your story</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => toggleSection('branches')}>
                            {branchesOpen ? <ChevronDown /> : <ChevronDown />}
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardHeader>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Visibility</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  Control who can see your story
                </p>
              </CardHeader>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Contributors</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  Manage who can contribute to your story
                </p>
              </CardHeader>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Revisions</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  View and compare previous versions of your story
                </p>
              </CardHeader>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Layout Options</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  Customize the layout of your story
                </p>
              </CardHeader>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Branches</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create and manage different versions of your story
                </p>
              </CardHeader>
            </Card>
          </div>
        </main>

        <div className="container mx-auto mb-8">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Visibility</CardTitle>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Public</h4>
                    <p className="text-sm text-muted-foreground">Anyone can view this story</p>
                  </div>
                  <Switch checked={isPublished} onCheckedChange={togglePublishStatus} />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Private</h4>
                    <p className="text-sm text-muted-foreground">Only invited contributors can view this story</p>
                  </div>
                  <Switch checked={!isPublished} onCheckedChange={() => togglePublishStatus()} />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Contributors</CardTitle>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Add Contributor</h4>
                  </div>
                  <Input placeholder="Search for a user" className="max-w-sm" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Contributor List</h4>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Contributors would be mapped here */}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Revisions</CardTitle>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Compare Revisions</h4>
                  </div>
                  <Button onClick={toggleCompare}>Compare Selected</Button>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Revision History</h4>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Revision</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {storyTitleRevisions.map((revision) => (
                        <TableRow key={revision.id}>
                          <TableCell>{revision.revision_number}</TableCell>
                          <TableCell>{new Date(revision.created_at).toLocaleString()}</TableCell>
                          <TableCell>Author</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Layout Options</CardTitle>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Select Layout</h4>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant={activeLayoutOption === 0 ? "default" : "outline"}
                      onClick={() => handleLayoutOptionClick(0)}
                    >
                      <LayoutList className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant={activeLayoutOption === 1 ? "default" : "outline"}
                      onClick={() => handleLayoutOptionClick(1)}
                    >
                      <Columns2 className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant={activeLayoutOption === 2 ? "default" : "outline"}
                      onClick={() => handleLayoutOptionClick(2)}
                    >
                      <Columns3 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Layout Preview</h4>
                  </div>
                  <div className="border rounded p-4 w-full h-40 flex items-center justify-center">
                    {activeLayoutOption !== null ? (
                      <p>Preview of Layout {activeLayoutOption + 1}</p>
                    ) : (
                      <p>Select a layout to preview</p>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Create Branch</CardTitle>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Branch Name</h4>
                  </div>
                  <Input placeholder="Enter branch name" className="max-w-sm" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Create</h4>
                  </div>
                  <Button>Create Branch</Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Branch List</CardTitle>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Name</h4>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Branches would be mapped here */}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="container mx-auto mb-8">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Chapters</CardTitle>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Chapter Title</h4>
                  </div>
                  <Input 
                    placeholder="Enter chapter title" 
                    value={newChapterTitle}
                    onChange={(e) => setNewChapterTitle(e.target.value)}
                    className="max-w-sm" 
                  />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Chapter Content</h4>
                  </div>
                  <ChapterEditor 
                    value={newChapterParagraphs}
                    onChange={setNewChapterParagraphs}
                  />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Add Chapter</CardTitle>
                </div>
                <Button 
                  onClick={() => {
                    if (newChapterTitle.trim()) {
                      handleCreateChapter({
                        chapter_title: newChapterTitle,
                        paragraphs: newChapterParagraphs.length ? newChapterParagraphs : [""]
                      });
                      setNewChapterTitle("");
                      setNewChapterParagraphs([""]);
                    } else {
                      toast({
                        title: "Chapter title required",
                        description: "Please enter a title for your chapter",
                        variant: "destructive"
                      });
                    }
                  }}
                >
                  Add Chapter
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Chapter List</CardTitle>
                </div>
              </div>
              <CardContent>
                {chaptersLoading ? (
                  <div className="flex justify-center items-center h-32">Loading chapters...</div>
                ) : chapters.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No chapters yet. Add your first chapter above.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chapters.map((chapter) => (
                      <Card key={chapter.chapter_id}>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle>{chapter.chapter_title}</CardTitle>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  // Edit chapter logic
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteChapter(chapter.chapter_id)}
                              >
                                <X className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {chapter.paragraphs && chapter.paragraphs.map((paragraph: string, idx: number) => (
                            <p key={idx} className="mb-4">{paragraph}</p>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </CardHeader>
          </Card>
        </div>

        <footer>
          <CrowdlyFooter />
        </footer>
      </div>
    </>
  );
};

export default NewStoryTemplate;
