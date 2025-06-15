import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import CrowdlyHeader from "@/components/CrowdlyHeader";
import CrowdlyFooter from "@/components/CrowdlyFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Book, Settings, Eye, HelpCircle, Copy, Plus, 
  Volume, Mic, Users, History, GitBranch, 
  ChevronRight, Image, Share2, ZoomIn,
  Video, AudioLines, ThumbsUp, ThumbsDown, Play,
  MessageCircle
} from "lucide-react";
import EditableText from "@/components/EditableText";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ResponsiveTabsTrigger from "@/components/ResponsiveTabsTrigger";
import { Tabs, TabsList, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const StoryToLiveToExperience = () => {
  const { user, roles, hasRole } = useAuth();
  const { toast } = useToast();
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>(["text"]);
  const [activeSection, setActiveSection] = useState<string>("story");
  
  // Changed to store likes/dislikes per chapter and media type
  const [chapterLikes, setChapterLikes] = useState<{[key: string]: number}>({
    chapter1: 35
  });
  const [chapterDislikes, setChapterDislikes] = useState<{[key: string]: number}>({
    chapter1: 6
  });
  
  // Add state for image/presentation likes/dislikes
  const [imageLikes, setImageLikes] = useState<{[key: string]: number}>({
    presentation1: 12
  });
  const [imageDislikes, setImageDislikes] = useState<{[key: string]: number}>({
    presentation1: 3
  });
  
  // Add state for audio likes/dislikes
  const [audioLikes, setAudioLikes] = useState<{[key: string]: number}>({
    audio1: 24
  });
  const [audioDislikes, setAudioDislikes] = useState<{[key: string]: number}>({
    audio1: 2
  });
  
  // Add state for video likes/dislikes
  const [videoLikes, setVideoLikes] = useState<{[key: string]: number}>({
    video1: 43
  });
  const [videoDislikes, setVideoDislikes] = useState<{[key: string]: number}>({
    video1: 5
  });
  
  // Add state for comments
  const [showCommentForm, setShowCommentForm] = useState<{[key: string]: boolean}>({});
  const [comments, setComments] = useState<{[key: string]: Array<{user: string, text: string}>}>({
    chapter1: [],
    presentation1: [],
    audio1: [],
    video1: []
  });
  const [newComment, setNewComment] = useState<string>("");
  const [commentTarget, setCommentTarget] = useState<string>("");
  
  const [showBranchDialog, setShowBranchDialog] = useState(false);
  const [selectedParagraphForBranch, setSelectedParagraphForBranch] = useState<string | null>(null);
  
  const userName = user?.email?.split("@")[0] || "Guest";
  
  // Sample data for tables
  const contributorsData = [
    { id: 1, name: "Lola Bridget", words: 5378, paragraphs: 15, chapters: 3 },
    { id: 2, name: "James Smith", words: 4892, paragraphs: 12, chapters: 2 },
    { id: 3, name: "Maria Garcia", words: 3256, paragraphs: 8, chapters: 1 }
  ];
  
  const revisionsData = [
    { id: 1, timestamp: "2025-05-06 09:23", description: "Title edit - Introduction" },
    { id: 2, timestamp: "2025-05-05 14:45", description: "Content change - Chapter 2" },
    { id: 3, timestamp: "2025-05-04 11:30", description: "New paragraph - Conclusion" }
  ];
  
  const branchesData = [
    { id: 1, title: "Main Storyline", author: "Lola Bridget", chapters: 5 },
    { id: 2, title: "Alternative Ending", author: "James Smith", chapters: 2 },
    { id: 3, title: "Character Background", author: "Maria Garcia", chapters: 3 }
  ];
  
  // New: dynamic chapters from Supabase
  const [chapters, setChapters] = useState<
    Array<{ id: string; number: number; title: string; paragraphs: string[] }>
  >([]);
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);

  // Add Chapter state
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newChapterParagraphs, setNewChapterParagraphs] = useState([""]);

  // Fetch chapters from Supabase
  useEffect(() => {
    async function fetchChapters() {
      // Fetch all chapters for the current story title (use 'Story of my life' for now)
      const { data: titleRow, error: titleError } = await supabase
        .from("story_title")
        .select("story_title_id")
        .eq("title", "Story of my life")
        .maybeSingle();

      if (!titleRow || titleError) {
        setChapters([]);
        return;
      }

      // Get all stories/chapters for the title
      const { data: chaptersData, error } = await supabase
        .from("stories")
        .select("chapter_id, chapter_title, paragraphs")
        .eq("story_title_id", titleRow.story_title_id);

      if (!chaptersData || error) {
        setChapters([]);
        return;
      }

      setChapters(
        chaptersData.map((c: any, i: number) => ({
          id: c.chapter_id,
          number: i + 1,
          title: c.chapter_title || `Chapter ${i + 1}`,
          paragraphs: Array.isArray(c.paragraphs) ? c.paragraphs : [""],
        }))
      );
    }

    fetchChapters();
  }, [showAddChapter]);

  // Handle switching chapters
  const handleSelectChapter = (idx: number) => {
    setActiveChapterIdx(idx);
    setShowAddChapter(false);
  };

  // Handle add chapter
  const handleAddChapterClick = () => {
    setShowAddChapter(true);
    setNewChapterTitle("");
    setNewChapterParagraphs([""]);
  };

  const handleSaveChapter = async () => {
    if (!user) {
      toast({
        title: "Unauthorized",
        description: "Log in to add a chapter.",
        variant: "destructive",
      });
      return;
    }
    // Grab story_title_id for "Story of my life"
    const { data: titleRow, error: titleError } = await supabase
      .from("story_title")
      .select("story_title_id")
      .eq("title", "Story of my life")
      .maybeSingle();
    if (!titleRow || titleError) {
      toast({
        title: "Failed to find story title",
        description: titleError?.message || "Story title not found.",
        variant: "destructive",
      });
      return;
    }

    // Save new chapter to "stories"
    const { error: insertError } = await supabase.from("stories").insert({
      story_title_id: titleRow.story_title_id,
      chapter_title: newChapterTitle,
      paragraphs: newChapterParagraphs,
      // chapter_id auto, creator handled by story_title
    });

    if (insertError) {
      toast({
        title: "Failed to add chapter",
        description: insertError.message,
        variant: "destructive",
      });
      console.error("Insert error:", insertError);
      return;
    } else {
      toast({
        title: "Chapter added",
        description: "Chapter saved successfully!",
      });
    }

    setShowAddChapter(false);
  };

  // Function to handle branch creation
  const handleCreateBranch = (paragraphId: string) => {
    setSelectedParagraphForBranch(paragraphId);
    setShowBranchDialog(true);
  };
  
  // Chapter like/dislike handlers
  const handleChapterLike = (id: string) => {
    setChapterLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };
  
  const handleChapterDislike = (id: string) => {
    setChapterDislikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };
  
  // Image/presentation like/dislike handlers
  const handleImageLike = (id: string) => {
    setImageLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };
  
  const handleImageDislike = (id: string) => {
    setImageDislikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };
  
  // Audio like/dislike handlers
  const handleAudioLike = (id: string) => {
    setAudioLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };
  
  const handleAudioDislike = (id: string) => {
    setAudioDislikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };
  
  // Video like/dislike handlers
  const handleVideoLike = (id: string) => {
    setVideoLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };
  
  const handleVideoDislike = (id: string) => {
    setVideoDislikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };
  
  // Toggle content type selection
  const toggleContentType = (type: string) => {
    if (selectedContentTypes.includes(type)) {
      setSelectedContentTypes(selectedContentTypes.filter(item => item !== type));
    } else {
      setSelectedContentTypes([...selectedContentTypes, type]);
    }
  };
  
  // Section toggle handler
  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? "" : section);
  };
  
  // Handle showing the comment form
  const handleShowCommentForm = (target: string) => {
    setCommentTarget(target);
    setNewComment("");
    setShowCommentForm(prev => ({
      ...prev,
      [target]: true
    }));
  };
  
  // Handle submitting a new comment
  const handleSubmitComment = () => {
    if (newComment.trim() !== "" && commentTarget) {
      setComments(prev => ({
        ...prev,
        [commentTarget]: [...(prev[commentTarget] || []), {
          user: userName,
          text: newComment.trim()
        }]
      }));
      setNewComment("");
      setShowCommentForm(prev => ({
        ...prev,
        [commentTarget]: false
      }));
    }
  };
  
  // Comments section component
  const CommentsSection = ({ targetId }: { targetId: string }) => {
    const targetComments = comments[targetId] || [];
    
    return (
      <div className="mt-8 pt-4 border-t">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            <EditableText id="comments-title">Comments</EditableText>
          </h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleShowCommentForm(targetId)}
          >
            <EditableText id="add-comment-btn">Add Comment</EditableText>
          </Button>
        </div>
        
        {showCommentForm[targetId] ? (
          <div className="mt-4 space-y-3">
            <Textarea
              placeholder="Write your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowCommentForm(prev => ({ ...prev, [targetId]: false }))}
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleSubmitComment}
              >
                Submit
              </Button>
            </div>
          </div>
        ) : null}
        
        {targetComments.length > 0 ? (
          <div className="space-y-4 mt-4">
            {targetComments.map((comment, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="font-medium text-sm">{comment.user}</div>
                <div className="text-sm mt-1">{comment.text}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 text-gray-500 italic">
            <EditableText id="no-comments">No comments yet. Be the first to share your thoughts.</EditableText>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <CrowdlyHeader />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Story Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Book className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold">
              <EditableText id="story-title">Story of my life</EditableText>
            </h1>

                  {/* New Settings/Read/Help buttons */}
                  <div className="flex items-center space-x-1">
                    {/* Settings Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem className="flex items-center">
                          <Copy className="mr-2 h-4 w-4" />
                          <EditableText id="clone-menu-item">Clone</EditableText>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center">
                          <Plus className="mr-2 h-4 w-4" />
                          <EditableText id="add-chapter-item">Add chapter</EditableText>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center">
                          <Copy className="mr-2 h-4 w-4" />
                          <EditableText id="export-menu-item">Export</EditableText>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    {/* Read Button */}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {/* Help Button */}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </div>




          </div>
          <div>
            <span className="text-gray-600">
              <EditableText id="welcome-message">Welcome {userName}</EditableText>
            </span>
          </div>
        </div>
        
        {/* Content Type Selector with Checkboxes */}
        <div className="flex mb-8 space-x-6 border-b pb-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="text-checkbox" 
              checked={selectedContentTypes.includes("text")} 
              onCheckedChange={() => toggleContentType("text")}
            />
            <Label htmlFor="text-checkbox">
              <EditableText id="content-type-text">text</EditableText>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="images-checkbox" 
              checked={selectedContentTypes.includes("images")} 
              onCheckedChange={() => toggleContentType("images")}
            />
            <Label htmlFor="images-checkbox">
              <EditableText id="content-type-images">images</EditableText>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="audio-checkbox" 
              checked={selectedContentTypes.includes("audio")} 
              onCheckedChange={() => toggleContentType("audio")}
            />
            <Label htmlFor="audio-checkbox">
              <EditableText id="content-type-audio">audio</EditableText>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="video-checkbox" 
              checked={selectedContentTypes.includes("video")} 
              onCheckedChange={() => toggleContentType("video")}
            />
            <Label htmlFor="video-checkbox">
              <EditableText id="content-type-video">video</EditableText>
            </Label>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Chapter Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow border p-4">
              <div className="pb-2">
                <h2 className="text-lg font-bold flex items-center mb-2">
                  <Book className="h-5 w-5 mr-2" />
                  Chapters
                </h2>
                {chapters.map((chapter, i) => (
                  <div
                    key={chapter.id}
                    className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                      i === activeChapterIdx
                        ? "bg-blue-50 border border-blue-400"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleSelectChapter(i)}
                  >
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">{chapter.number}.</span>
                      <span className="text-sm">{chapter.title}</span>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {/* Add Chapter Button */}
                {user && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={handleAddChapterClick}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Chapter
                  </Button>
                )}
                {!user && (
                  <div className="mt-4 text-gray-400 text-xs text-center">
                    Log in to add new chapters.
                  </div>
                )}
                {showAddChapter && user && (
                  <div className="mt-4 space-y-2">
                    <Input
                      placeholder="Chapter title"
                      value={newChapterTitle}
                      onChange={(e) => setNewChapterTitle(e.target.value)}
                    />
                    {newChapterParagraphs.map((para, idx) => (
                      <Input
                        key={idx}
                        placeholder={`Paragraph ${idx + 1}`}
                        value={para}
                        onChange={(e) => {
                          const updated = [...newChapterParagraphs];
                          updated[idx] = e.target.value;
                          setNewChapterParagraphs(updated);
                        }}
                      />
                    ))}
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        setNewChapterParagraphs((prev) => [...prev, ""])
                      }
                    >
                      + Add Paragraph
                    </Button>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        onClick={handleSaveChapter}
                        disabled={!newChapterTitle.trim()}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowAddChapter(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-3">
          
            {/* Responsive Tabs for Story/Contributors/Revisions/Branches */}
            <Tabs defaultValue="story" className="w-full">
              <TabsList className="w-full mb-6 border-b overflow-x-auto flex justify-start">
                <ResponsiveTabsTrigger 
                  value="story"
                  icon={<Book className="h-4 w-4" />}
                  text={<EditableText id="story-tab">Story</EditableText>}
                  active={activeSection === 'story' || activeSection === ''}
                  onClick={() => toggleSection('story')}
                />
                <ResponsiveTabsTrigger 
                  value="contributors"
                  icon={<Users className="h-4 w-4" />} 
                  text={<EditableText id="contributors-tab">Contributors</EditableText>}
                  active={activeSection === 'contributors'}
                  onClick={() => toggleSection('contributors')}
                />
                <ResponsiveTabsTrigger 
                  value="revisions"
                  icon={<History className="h-4 w-4" />} 
                  text={<EditableText id="revisions-tab">Revisions</EditableText>}
                  active={activeSection === 'revisions'}
                  onClick={() => toggleSection('revisions')}
                />
                <ResponsiveTabsTrigger 
                  value="branches"
                  icon={<GitBranch className="h-4 w-4" />} 
                  text={<EditableText id="branches-tab">Branches</EditableText>}
                  active={activeSection === 'branches'}
                  onClick={() => toggleSection('branches')}
                />
              </TabsList>
              
              {/* Story Content */}
              {(activeSection === "story" || activeSection === "") && (
                <div className="space-y-6">
                  {/* Only show text content if selected */}
                  {selectedContentTypes.includes("text") && chapters[activeChapterIdx] && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="prose max-w-none">
                          <h2 className="text-xl font-semibold mb-4">
                            <EditableText id={`chapter-title-${chapters[activeChapterIdx].id}`}>
                              {chapters[activeChapterIdx].title}
                            </EditableText>
                          </h2>
                          {chapters[activeChapterIdx].paragraphs &&
                            chapters[activeChapterIdx].paragraphs.map(
                              (paragraph: string, idx: number) => (
                                <div key={idx} className="mb-4">
                                  <EditableText id={`paragraph-${chapters[activeChapterIdx].id}-${idx}`}>
                                    {paragraph}
                                  </EditableText>
                                </div>
                              )
                            )}
                          {/* Like/dislike and comments just for "text" (chapter) */}
                          <div className="mt-8 pt-4 border-t flex items-center space-x-2">
                            <button 
                              onClick={() => handleChapterLike(chapters[activeChapterIdx].id)} 
                              className="flex items-center text-sm text-gray-500 hover:text-blue-500"
                            >
                              <ThumbsUp className="h-5 w-5 mr-1" />
                              <span>{chapterLikes[chapters[activeChapterIdx].id] || 0}</span>
                            </button>
                            <button 
                              onClick={() => handleChapterDislike(chapters[activeChapterIdx].id)} 
                              className="flex items-center text-sm text-gray-500 hover:text-red-500"
                            >
                              <ThumbsDown className="h-5 w-5 mr-1" />
                              <span>{chapterDislikes[chapters[activeChapterIdx].id] || 0}</span>
                            </button>
                          </div>
                          <CommentsSection targetId={chapters[activeChapterIdx].id} />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Only show Images/Cartoon/Presentation player if selected */}
                  {selectedContentTypes.includes("images") && (
                    <Card>
                      <CardContent className="pt-6">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium flex items-center">
                              <Image className="h-5 w-5 mr-2" />
                              <EditableText id="presentation-title">Presentation / Cartoon</EditableText>
                            </h3>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <ZoomIn className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="bg-gray-200 h-64 flex flex-col items-center justify-center rounded">
                            <div className="h-48 w-48 bg-gray-300 rounded flex items-center justify-center mb-4">
                              <Play className="h-12 w-12 text-gray-500" />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <EditableText id="prev-image">Previous</EditableText>
                              </Button>
                              <span className="text-sm">1 / 5</span>
                              <Button variant="outline" size="sm">
                                <EditableText id="next-image">Next</EditableText>
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            <EditableText id="image-caption">Slide caption: Describe what is shown in the presentation slide.</EditableText>
                          </p>
                          <div className="mt-6 pt-4 border-t flex items-center space-x-2">
                            <button 
                              onClick={() => handleImageLike("presentation1")} 
                              className="flex items-center text-sm text-gray-500 hover:text-blue-500"
                            >
                              <ThumbsUp className="h-5 w-5 mr-1" />
                              <span>{imageLikes.presentation1 || 0}</span>
                            </button>
                            <button 
                              onClick={() => handleImageDislike("presentation1")} 
                              className="flex items-center text-sm text-gray-500 hover:text-red-500"
                            >
                              <ThumbsDown className="h-5 w-5 mr-1" />
                              <span>{imageDislikes.presentation1 || 0}</span>
                            </button>
                          </div>
                          <CommentsSection targetId="presentation1" />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Only show Audio player if selected */}
                  {selectedContentTypes.includes("audio") && (
                    <Card>
                      <CardContent className="pt-6">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium flex items-center">
                              <AudioLines className="h-5 w-5 mr-2" />
                              <EditableText id="audio-title">Audio Player</EditableText>
                            </h3>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="bg-gray-100 p-4 rounded">
                            <div className="flex items-center space-x-2 mb-3">
                              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full flex items-center justify-center">
                                <Play className="h-6 w-6" />
                              </Button>
                              <div className="w-full">
                                <div className="bg-gray-300 h-2 rounded-full w-full overflow-hidden">
                                  <div className="bg-primary h-full w-1/3 rounded-full"></div>
                                </div>
                                <div className="flex justify-between mt-1 text-xs text-gray-500">
                                  <span>1:23</span>
                                  <span>3:45</span>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Volume className="h-5 w-5" />
                              </Button>
                            </div>
                            <p className="text-sm text-gray-500 italic">
                              <EditableText id="audio-description">Audio description: Narrative of Chapter 1, read by the author.</EditableText>
                            </p>
                          </div>
                          <div className="mt-6 pt-4 border-t flex items-center space-x-2">
                            <button 
                              onClick={() => handleAudioLike("audio1")} 
                              className="flex items-center text-sm text-gray-500 hover:text-blue-500"
                            >
                              <ThumbsUp className="h-5 w-5 mr-1" />
                              <span>{audioLikes.audio1 || 0}</span>
                            </button>
                            <button 
                              onClick={() => handleAudioDislike("audio1")} 
                              className="flex items-center text-sm text-gray-500 hover:text-red-500"
                            >
                              <ThumbsDown className="h-5 w-5 mr-1" />
                              <span>{audioDislikes.audio1 || 0}</span>
                            </button>
                          </div>
                          <CommentsSection targetId="audio1" />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Only show Video player if selected */}
                  {selectedContentTypes.includes("video") && (
                    <Card>
                      <CardContent className="pt-6">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium flex items-center">
                              <Video className="h-5 w-5 mr-2" />
                              <EditableText id="video-title">Video Player</EditableText>
                            </h3>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <ZoomIn className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="bg-gray-800 h-72 rounded flex flex-col items-center justify-center">
                            <Play className="h-16 w-16 text-white opacity-70 hover:opacity-100 cursor-pointer" />
                            <div className="absolute bottom-4 w-11/12 opacity-0 hover:opacity-100 transition-opacity">
                              <div className="bg-gray-900 bg-opacity-70 p-2 rounded">
                                <div className="bg-gray-300 h-2 rounded-full w-full overflow-hidden">
                                  <div className="bg-primary h-full w-1/4 rounded-full"></div>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                  <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                                      <Play className="h-4 w-4" />
                                    </Button>
                                    <span className="text-xs text-gray-200">0:35 / 2:18</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                                      <Volume className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            <EditableText id="video-caption">Video caption: Visual interpretation of Chapter 1 - The Beginning.</EditableText>
                          </p>
                          <div className="mt-6 pt-4 border-t flex items-center space-x-2">
                            <button 
                              onClick={() => handleVideoLike("video1")} 
                              className="flex items-center text-sm text-gray-500 hover:text-blue-500"
                            >
                              <ThumbsUp className="h-5 w-5 mr-1" />
                              <span>{videoLikes.video1 || 0}</span>
                            </button>
                            <button 
                              onClick={() => handleVideoDislike("video1")} 
                              className="flex items-center text-sm text-gray-500 hover:text-red-500"
                            >
                              <ThumbsDown className="h-5 w-5 mr-1" />
                              <span>{videoDislikes.video1 || 0}</span>
                            </button>
                          </div>
                          <CommentsSection targetId="video1" />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Dialog for creating a new branch */}
                  <Dialog open={showBranchDialog} onOpenChange={setShowBranchDialog}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create a New Branch</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="branch-name">Branch Name</Label>
                          <Input id="branch-name" placeholder="Enter a name for your branch" />
                        </div>
                        <div>
                          <Label htmlFor="branch-description">Description</Label>
                          <Textarea id="branch-description" placeholder="Briefly describe your branch" />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowBranchDialog(false)}>
                            Cancel
                          </Button>
                          <Button>
                            Create Branch
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
              
              {/* Contributors Content */}
              {activeSection === 'contributors' && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <EditableText id="contributors-title">Contributors</EditableText>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            <EditableText id="contributor-name">Name</EditableText>
                          </TableHead>
                          <TableHead>
                            <EditableText id="words-contributed">Words</EditableText>
                          </TableHead>
                          <TableHead>
                            <EditableText id="paragraphs-contributed">Paragraphs</EditableText>
                          </TableHead>
                          <TableHead>
                            <EditableText id="chapters-contributed">Chapters</EditableText>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contributorsData.map((contributor) => (
                          <TableRow key={contributor.id}>
                            <TableCell className="font-medium">{contributor.name}</TableCell>
                            <TableCell>{contributor.words}</TableCell>
                            <TableCell>{contributor.paragraphs}</TableCell>
                            <TableCell>{contributor.chapters}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
              
              {/* Revisions Content */}
              {activeSection === 'revisions' && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <EditableText id="revisions-title">Revision History</EditableText>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {revisionsData.map((revision) => (
                        <div key={revision.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{revision.description}</div>
                            <div className="text-gray-500 text-sm">{revision.timestamp}</div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            <EditableText id="view-revision-btn">View</EditableText>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Branches Content */}
              {activeSection === 'branches' && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <EditableText id="branches-title">Story Branches</EditableText>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {branchesData.map((branch) => (
                        <div key={branch.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{branch.title}</div>
                            <div className="text-gray-500 text-sm">By {branch.author} · {branch.chapters} chapters</div>
                          </div>
                          <Button variant="outline" size="sm" className="flex items-center">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </Tabs>
          </div>
        </div>
      </main>

      <Button variant="outline" size="sm" className="mt-4 w-full">
        <EditableText id="add-chapter-btn">Next Chapter</EditableText>
      </Button>

      
      <CrowdlyFooter />
    </div>
  );
};

export default StoryToLiveToExperience;
