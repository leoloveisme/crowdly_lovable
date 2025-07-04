
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
import LayoutOptionButtons from "@/components/LayoutOptionButtons";
import RevisionCheckboxCell from "@/components/RevisionCheckboxCell";
import { useAuth } from "@/contexts/AuthContext";
import StorySelector from "@/components/StorySelector";
import NewStoryDialog from "@/components/NewStoryDialog";

const NewStoryTemplate = () => {
  const [storyTitleId, setStoryTitleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [chapters, setChapters] = useState<any[]>([]);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [addChapterMode, setAddChapterMode] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newChapterParagraphs, setNewChapterParagraphs] = useState<string[]>([]);
  const [mainTitle, setMainTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [intro, setIntro] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

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
  const [stories, setStories] = useState<any[]>([]); // List of all user's stories

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

  // Fetch all user stories (Story List)
  const fetchAllUserStories = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("story_title")
      .select("*")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: true });
    if (!error && data) {
      setStories(data);
    }
  };

  // New: create a new story, set as selected & navigate
  const handleCreateNewStory = async (title: string) => {
    if (!user) return;
    // Insert new story_title
    const { data: inserted, error: insertErr } = await supabase
      .from("story_title")
      .insert({ title, creator_id: user.id })
      .select()
      .maybeSingle();
    if (insertErr || !inserted) {
      toast({
        title: "Failed to create story",
        description: insertErr?.message || "Unknown error",
        variant: "destructive"
      });
      return;
    }

    // Insert initial revision for the new story
    await supabase.from("story_title_revisions").insert({
      story_title_id: inserted.story_title_id,
      prev_title: null,
      new_title: inserted.title,
      created_by: user.id,
      revision_number: 1,
      revision_reason: "Initial creation",
      language: "en"
    });

    // NEW: Insert initial template chapter so it appears in Newest section
    const defaultChapterTitle = "Intro";
    const defaultParagraphs = ["This is the beginning!"];

    const { error: chapterErr } = await supabase.from("stories").insert({
      story_title_id: inserted.story_title_id,
      chapter_title: defaultChapterTitle,
      paragraphs: defaultParagraphs
    });

    if (chapterErr) {
      toast({
        title: "Failed to add the first chapter",
        description: chapterErr.message,
        variant: "destructive"
      });
      // Still proceed to select/navigate etc, so user can fix manually
    }

    // reload story list
    await fetchAllUserStories();
    // Select and redirect to the new story page
    setStoryTitleId(inserted.story_title_id);
    setMainTitle(inserted.title);
    fetchStoryTitleRevisions(inserted.story_title_id);
    navigate(`/story/${inserted.story_title_id}`);
  };

  // On mount or when user changes, fetch all stories and default to first story
  useEffect(() => {
    if (!user) return;
    const fetchForUser = async () => {
      await fetchAllUserStories();
      setLoading(false);
    };
    fetchForUser();
  }, [user]);

  // Watch stories, pick default story if none selected
  useEffect(() => {
    if (!storyTitleId && stories.length > 0) {
      setStoryTitleId(stories[0].story_title_id);
      setMainTitle(stories[0].title);
    }
  }, [stories]);

  // On storyTitleId change, load that story's title and revisions
  useEffect(() => {
    if (!storyTitleId) return;
    const story = stories.find((s) => s.story_title_id === storyTitleId);
    if (story) setMainTitle(story.title);
    fetchStoryTitleRevisions(storyTitleId);
  }, [storyTitleId]);

  // Helper: fetch story title by ID and update mainTitle state
  const fetchStoryTitleById = async (id: string) => {
    const { data: titleRow, error } = await supabase
      .from("story_title")
      .select()
      .eq("story_title_id", id)
      .maybeSingle();
    if (!error && titleRow && titleRow.title) {
      setMainTitle(titleRow.title);
    }
  };

  // CRUD: Load All Chapters when story changes
  useEffect(() => {
    if (!storyTitleId) return;
    setChaptersLoading(true);
    supabase
      .from("stories")
      .select()
      .eq("story_title_id", storyTitleId)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
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
      });
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

  // CRUD: Update Story Title
  const handleUpdateStoryTitle = async (updatedTitle: string) => {
    if (!storyTitleId || !updatedTitle.trim()) {
      toast({
        title: "No title entered",
        description: "Please provide a non-empty title.",
        variant: "destructive",
      });
      return;
    }
    setSavingTitle(true);

    const prevTitle = mainTitle;
    // Debugging: log IDs and context to console
    console.log("Attempting to update story_title", { storyTitleId, updatedTitle, prevTitle, user });

    // Update title in database
    const { data: updateData, error: updateErr } = await supabase
      .from("story_title")
      .update({ title: updatedTitle })
      .eq("story_title_id", storyTitleId)
      .select();

    setSavingTitle(false);

    if (updateErr) {
      toast({
        title: "Failed to update title",
        description: updateErr.message,
        variant: "destructive",
      });
      return;
    }

    // If no rows were actually updated:
    if (!updateData || updateData.length === 0) {
      toast({
        title: "No story title row was updated.",
        description:
          "Possible reasons: (1) Row does not exist, (2) You are not the creator, (3) Row's creator_id does not match your user id. Please check Supabase table.",
        variant: "destructive",
      });
      // Extra debug log
      console.log("No rows updated in story_title. Data:", updateData);
      return;
    }

    // Success: update UI 
    setMainTitle(updateData[0].title);
    setEditingTitle(false);
    setNewTitle(updateData[0].title);

    // Refresh story list!
    fetchAllUserStories();

    toast({ title: "Title updated!" });

    // Insert a new revision for the story_title
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
    await supabase.from("story_title_revisions").insert({
      story_title_id: storyTitleId,
      prev_title: prevTitle,
      new_title: updateData[0].title,
      created_by: user?.id ?? null, // set to user.id if available
      revision_number: nextRevision,
      revision_reason: "Manual update",
      language: "en"
    });
    fetchStoryTitleRevisions(storyTitleId);
    fetchStoryTitleById(storyTitleId);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-32">You must be logged in to use this template.</div>
    );
  }

  if (loading) {
    return <div className="flex justify-center items-center h-32">Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <header>
          <CrowdlyHeader />
        </header>

        {/* New: Story Selection Bar */}
        <div className="container mx-auto mb-4 mt-4 flex flex-wrap gap-4 items-center">
          <StorySelector
            stories={stories}
            selectedStoryId={storyTitleId}
            onSelect={(id) => setStoryTitleId(id)}
          />
          <NewStoryDialog onCreate={handleCreateNewStory} />
        </div>

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
                  <Button onClick={toggleCompare} disabled={selectedRevisions.length === 0}>
                    Compare Selected
                  </Button>
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
                        <TableHead>Compare</TableHead>
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
                            <RevisionCheckboxCell
                              revisionId={revision.id}
                              selectedRevisions={selectedRevisions}
                              setSelectedRevisions={setSelectedRevisions}
                            />
                          </TableCell>
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
              <div className="mt-4 flex flex-wrap justify-between items-center w-full">
                <div>
                  <h4 className="font-medium">Select Layout</h4>
                </div>
                <LayoutOptionButtons
                  active={activeLayoutOption}
                  onSelect={handleLayoutOptionClick}
                  className="flex-shrink-0"
                />
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
                    chapters={chapters}
                    onCreate={handleCreateChapter}
                    onUpdate={handleUpdateChapter}
                    onDelete={handleDeleteChapter}
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
