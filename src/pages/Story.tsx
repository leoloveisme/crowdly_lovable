import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Users, Clock, GitBranch, BookText } from "lucide-react";
import CrowdlyHeader from "@/components/CrowdlyHeader";
import CrowdlyFooter from "@/components/CrowdlyFooter";
import EditableText from "@/components/EditableText";
import ChapterEditor from "@/components/ChapterEditor";
import ChapterInteractions from "@/components/ChapterInteractions";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import ParagraphBranchPopover from "@/components/ParagraphBranchPopover";
import StoryContentTypeSelector from "@/components/StoryContentTypeSelector";
import StoryBranchList from "@/components/StoryBranchList";

// --- Placeholder modular components for each section ---
const ContributorsSection = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Contributors</h2>
    {/* Placeholder for contributors table, CRUD logic goes here */}
    <div className="bg-white border rounded p-6 shadow-sm">
      <div className="text-lg mb-2 font-medium">Contributors</div>
      <div className="text-gray-400 text-sm">This section will list all contributors to this story.</div>
    </div>
  </div>
);
const RevisionsSection = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Revision History</h2>
    {/* Placeholder for revision history */}
    <div className="bg-white border rounded p-6 shadow-sm">
      <div className="text-gray-400 text-sm">All content changes and revision logs will appear here.</div>
    </div>
  </div>
);
const BranchesSection = ({ storyId }: { storyId: string }) => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Story Branches</h2>
    <StoryBranchList storyId={storyId} />
  </div>
);

// --- MAIN COMPONENT ---
const Story = () => {
  const { story_id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, roles, hasRole } = useAuth();
  const [story, setStory] = useState<{ story_title_id: string; title: string; creator_id?: string } | null>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // UI tab state
  const [activeTab, setActiveTab] = useState<"story" | "contributors" | "revisions" | "branches">("story");

  // --- Add missing state hooks for title editing ---
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [savingTitle, setSavingTitle] = useState(false);

  // Fetch story and chapters, now also fetch creator_id
  const fetchStoryAndChapters = async () => {
    setLoading(true);
    // Fetch story title WITH creator_id
    const { data: titleRow, error: titleError } = await supabase
      .from("story_title")
      .select("*")
      .eq("story_title_id", story_id)
      .maybeSingle();
    if (titleError || !titleRow) {
      setStory(null);
      setLoading(false);
      return;
    }
    setStory(titleRow);

    // Fetch chapters
    const { data: chaptersData, error: chaptersError } = await supabase
      .from("stories")
      .select()
      .eq("story_title_id", story_id)
      .order("created_at", { ascending: true });
    if (!chaptersError && chaptersData) {
      setChapters(chaptersData);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (story_id) {
      fetchStoryAndChapters();
    }
    // eslint-disable-next-line
  }, [story_id]);

  // Permission checks
  const canDeleteStory =
    user &&
    story &&
    (
      story.creator_id === user.id ||
      hasRole("platform_admin") ||
      hasRole("editor")
    );

  // DELETE Story handler
  const handleDeleteStory = async () => {
    if (!story) return;
    if (!canDeleteStory) return toast({ title: "Unauthorized", description: "You are not allowed to delete this story.", variant: "destructive" });
    if (!window.confirm("Are you sure you want to permanently delete this story? This cannot be undone.")) return;
    const { error } = await supabase
      .from("story_title")
      .delete()
      .eq("story_title_id", story.story_title_id);
    if (error) {
      toast({ title: "Error", description: "Could not delete story", variant: "destructive" });
    } else {
      toast({ title: "Story deleted", description: "The story has been removed." });
      navigate("/");
    }
  };

  // Title Editing Handlers
  const handleStartEditTitle = () => {
    setTitleInput(story?.title || "");
    setIsEditingTitle(true);
  };
  const handleCancelEditTitle = () => {
    setIsEditingTitle(false);
    setTitleInput(story?.title || "");
  };
  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleInput(e.target.value);
  };
  const handleSaveTitle = async () => {
    if (!titleInput.trim() || !story_id) return;
    setSavingTitle(true);
    const prevTitle = story?.title ?? null;
    const newTitle = titleInput.trim();

    console.log("[Story.tsx handleSaveTitle] Attempting update:", newTitle, "for story_id:", story_id);

    // Perform update
    const { error } = await supabase
      .from("story_title")
      .update({ title: newTitle })
      .eq("story_title_id", story_id);

    setSavingTitle(false);

    if (error) {
      toast({ title: "Error", description: "Could not update title", variant: "destructive" });
      console.error("[Story.tsx handleSaveTitle] Supabase update error:", error);
      return;
    }

    // Fetch updated story row to update UI state
    const { data: updatedRow, error: fetchError } = await supabase
      .from("story_title")
      .select("*")
      .eq("story_title_id", story_id)
      .maybeSingle();

    if (fetchError) {
      toast({ title: "Error fetching updated story", description: fetchError.message, variant: "destructive" });
      console.error("[Story.tsx handleSaveTitle] Fetch error:", fetchError);
      return;
    }

    if (!updatedRow) {
      toast({ title: "Update failed", description: "No matching story found to update!", variant: "destructive" });
      console.warn("[Story.tsx handleSaveTitle] No matching story. newTitle:", newTitle, "story_id:", story_id);
      return;
    }

    setStory(updatedRow);
    setIsEditingTitle(false);

    toast({ title: "Story Title updated", description: "The title has been changed." });

    // Insert revision
    await insertStoryTitleRevision(story_id, prevTitle, newTitle, user?.id ?? null);

    // Optionally refetch chapters if you want (already in fetchStoryAndChapters)
    fetchStoryAndChapters();
  };

  // CRUD Handlers for chapters
  // CREATE
  const handleCreateChapter = async ({ chapter_title, paragraphs }: { chapter_title: string; paragraphs: string[] }) => {
    if (!story_id) return;
    const { error } = await supabase.from("stories").insert([
      {
        chapter_title,
        paragraphs,
        story_title_id: story_id,
      },
    ]);
    if (error) {
      toast({ title: "Error", description: "Failed to add chapter", variant: "destructive" });
    } else {
      toast({ title: "Chapter Created", description: `Added chapter "${chapter_title}".` });
      fetchStoryAndChapters();
    }
  };
  // UPDATE
  const handleUpdateChapter = async (
    chapter_id: string,
    patch: { chapter_title?: string; paragraphs?: string[] }
  ) => {
    const { error } = await supabase.from("stories").update(patch).eq("chapter_id", chapter_id);
    if (error) {
      toast({ title: "Error", description: "Failed to update chapter", variant: "destructive" });
    } else {
      toast({ title: "Chapter Updated", description: "Saved changes." });
      fetchStoryAndChapters();
    }
  };
  // DELETE
  const handleDeleteChapter = async (chapter_id: string) => {
    const { error } = await supabase.from("stories").delete().eq("chapter_id", chapter_id);
    if (error) {
      toast({ title: "Error", description: "Could not delete chapter", variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Chapter removed" });
      fetchStoryAndChapters();
    }
  };

  // NEW: Branch creation logic
  const handleCreateBranchForParagraph = async ({
    branchName,
    paragraphs,
    language,
    metadata,
    chapterId,
    paragraphIndex,
    paragraphText,
  }: {
    branchName: string;
    paragraphs: string[];
    language: string;
    metadata: any;
    chapterId: string;
    paragraphIndex: number;
    paragraphText: string;
  }) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You must be logged in to create a branch.",
        variant: "destructive",
      });
      return;
    }
    // Compose branch_text as joined array (could be improved later)
    const branch_text = paragraphs.join("\n\n");
    // parent_paragraph_text: use provided or empty
    try {
      const { error } = await supabase.from("paragraph_branches").insert({
        chapter_id: chapterId,
        parent_paragraph_index: paragraphIndex,
        parent_paragraph_text: branchName || paragraphText || "",
        branch_text,
        user_id: user.id,
        language,
        metadata: metadata ?? null,
      });
      if (error) {
        toast({
          title: "Error",
          description: "Failed to create branch. " + (error.message || ""),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Branch created",
          description: "Your branch has been saved.",
        });
        // Optionally, refresh the branch list (if you want it to show up immediately)
        // If you want to refresh, trigger the fetch/logic used for branch reload.
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong creating the branch.",
        variant: "destructive",
      });
    }
  };

  // Only allow chapter/paragraph CRUD for logged-in users:
  // For chapter editor: if no user, render as read-only/disabled
  const canCRUDChapters = !!user;

  // --- NEW: Fetch revision history for story title ---
  const [storyTitleRevisions, setStoryTitleRevisions] = useState<any[]>([]);
  const fetchStoryTitleRevisions = async () => {
    if (!story_id) return;
    const { data, error } = await supabase
      .from("story_title_revisions")
      .select("*")
      .eq("story_title_id", story_id)
      .order("revision_number", { ascending: true });
    if (!error && data) setStoryTitleRevisions(data);
  };

  // --- NEW: Fetch chapter revisions for each chapter ---
  const [chapterRevisions, setChapterRevisions] = useState<{ [chapterId: string]: any[] }>({});
  const fetchChapterRevisions = async (chapterId: string) => {
    const { data, error } = await supabase
      .from("chapter_revisions")
      .select("*")
      .eq("chapter_id", chapterId)
      .order("revision_number", { ascending: true });
    if (!error && data) {
      setChapterRevisions((prev) => ({ ...prev, [chapterId]: data }));
    }
  };

  // --- NEW: Fetch paragraph revisions for each chapter ---
  const [paragraphRevisions, setParagraphRevisions] = useState<{ [chapterId: string]: { [idx: number]: any[] } }>({});
  const fetchParagraphRevisions = async (chapterId: string, paragraphIndex: number) => {
    const { data, error } = await supabase
      .from("paragraph_revisions")
      .select("*")
      .eq("chapter_id", chapterId)
      .eq("paragraph_index", paragraphIndex)
      .order("revision_number", { ascending: true });
    if (!error && data) {
      setParagraphRevisions((prev) => ({
        ...prev,
        [chapterId]: { ...prev[chapterId], [paragraphIndex]: data },
      }));
    }
  };

  // --- NEW: Insert revision for story title ---
  const insertStoryTitleRevision = async (
    storyTitleId: string,
    prevTitle: string | null,
    newTitle: string,
    createdBy: string,
    reason?: string,
    language?: string
  ) => {
    // Fetch latest revision_number
    const { data: lastRevs, error: revError } = await supabase
      .from("story_title_revisions")
      .select("revision_number")
      .eq("story_title_id", storyTitleId)
      .order("revision_number", { ascending: false })
      .limit(1);
    const nextRevision = (lastRevs && lastRevs[0]?.revision_number ? lastRevs[0].revision_number + 1 : 1);
    await supabase.from("story_title_revisions").insert({
      story_title_id: storyTitleId,
      prev_title: prevTitle,
      new_title: newTitle,
      created_by: createdBy,
      revision_number: nextRevision,
      revision_reason: reason || null,
      language: language || "en"
    });
    fetchStoryTitleRevisions();
  };

  // --- NEW: Insert revision for chapter ---
  const insertChapterRevision = async (
    chapterId: string,
    prevTitle: string | null,
    newTitle: string,
    prevParagraphs: string[] | null,
    newParagraphs: string[],
    createdBy: string,
    reason?: string,
    language?: string
  ) => {
    // Fetch latest revision_number
    const { data: lastRevs, error: revError } = await supabase
      .from("chapter_revisions")
      .select("revision_number")
      .eq("chapter_id", chapterId)
      .order("revision_number", { ascending: false })
      .limit(1);
    const nextRevision = (lastRevs && lastRevs[0]?.revision_number ? lastRevs[0].revision_number + 1 : 1);
    await supabase.from("chapter_revisions").insert({
      chapter_id: chapterId,
      prev_chapter_title: prevTitle,
      new_chapter_title: newTitle,
      prev_paragraphs: prevParagraphs,
      new_paragraphs: newParagraphs,
      created_by: user.id,
      revision_number: nextRevision,
      revision_reason: reason || null,
      language: language || "en"
    });
    fetchChapterRevisions(chapterId);
  };

  // --- NEW: Insert revision for paragraph ---
  const insertParagraphRevision = async (
    chapterId: string,
    paragraphIndex: number,
    prevParagraph: string | null,
    newParagraph: string,
    createdBy: string,
    reason?: string,
    language?: string
  ) => {
    // Fetch latest revision_number
    const { data: lastRevs, error: revError } = await supabase
      .from("paragraph_revisions")
      .select("revision_number")
      .eq("chapter_id", chapterId)
      .eq("paragraph_index", paragraphIndex)
      .order("revision_number", { ascending: false })
      .limit(1);
    const nextRevision = (lastRevs && lastRevs[0]?.revision_number ? lastRevs[0].revision_number + 1 : 1);
    await supabase.from("paragraph_revisions").insert({
      chapter_id: chapterId,
      paragraph_index: paragraphIndex,
      prev_paragraph: prevParagraph,
      new_paragraph: newParagraph,
      created_by: createdBy,
      revision_number: nextRevision,
      revision_reason: reason || null,
      language: language || "en"
    });
    fetchParagraphRevisions(chapterId, paragraphIndex);
  };

  // --- Load revision data on mount ---
  useEffect(() => {
    if (story_id) {
      fetchStoryTitleRevisions();
    }
    // Fetch chapters revision for all chapters
    chapters.forEach((c) => fetchChapterRevisions(c.chapter_id));
  // eslint-disable-next-line
  }, [story_id, chapters.length]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <CrowdlyHeader />
        <div className="flex-grow flex justify-center items-center">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
        <CrowdlyFooter />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex flex-col min-h-screen">
        <CrowdlyHeader />
        <div className="flex-grow flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Story not found</p>
          <a href="/" className="text-blue-500 hover:text-blue-700 underline">
            Return to Home
          </a>
        </div>
        <CrowdlyFooter />
      </div>
    );
  }

  // --- NEW: Revision History UI, integrated under the "Revisions" tab ---
  const RevisionsSection = () => (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Revision History</h2>
      {/* Story Title revisions */}
      <div className="mb-4">
        <h3 className="font-bold">Story Title history</h3>
        <ul className="bg-white border rounded p-2 shadow-sm">
          {storyTitleRevisions.map((rev, i) => (
            <li key={rev.id} className="py-1">
              <span className="font-medium">{rev.new_title}</span>{" "}
              <span className="text-xs text-gray-500">(By {rev.created_by?.slice(0, 8)} at {new Date(rev.created_at).toLocaleString()}, rev {rev.revision_number})</span>
              {rev.revision_reason && (
                <span className="ml-3 px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-700">{rev.revision_reason}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      {/* Chapter revisions */}
      <div>
        <h3 className="font-bold">Chapters history</h3>
        {chapters.map((chapter) => (
          <div key={chapter.chapter_id} className="mb-2">
            <div className="font-semibold text-indigo-700">Ch. {chapter.chapter_title}</div>
            <ul className="bg-white border rounded p-2">
              {(chapterRevisions[chapter.chapter_id] || []).map((rev) => (
                <li key={rev.id} className="py-1">
                  <span className="font-medium">{rev.new_chapter_title}</span>{" "}
                  <span className="text-xs text-gray-500">(By {rev.created_by?.slice(0, 8)} at {new Date(rev.created_at).toLocaleString()}, rev {rev.revision_number})</span>
                  {rev.revision_reason && (
                    <span className="ml-3 px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-700">{rev.revision_reason}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <CrowdlyHeader />

      {/* --- STORY CONTENT TYPE SELECTOR --- */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <StoryContentTypeSelector chapters={chapters} />
        {/* --- TABS & NAVIGATION HEADER --- */}
        <nav className="container mx-auto max-w-3xl px-4 pt-8">
          <div className="flex flex-row items-center gap-2 border rounded-lg bg-gray-50 overflow-x-auto">
            <button
              aria-label="Story"
              onClick={() => setActiveTab("story")}
              className={`flex items-center px-3 py-2 rounded transition font-medium text-sm gap-2 ${
                activeTab === "story"
                  ? "bg-white border border-blue-300 text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <BookText size={18} /> Story
            </button>
            <button
              aria-label="Contributors"
              onClick={() => setActiveTab("contributors")}
              className={`flex items-center px-3 py-2 rounded transition font-medium text-sm gap-2 ${
                activeTab === "contributors"
                  ? "bg-white border border-blue-300 text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Users size={18} /> Contributors
            </button>
            <button
              aria-label="Revisions"
              onClick={() => setActiveTab("revisions")}
              className={`flex items-center px-3 py-2 rounded transition font-medium text-sm gap-2 ${
                activeTab === "revisions"
                  ? "bg-white border border-blue-300 text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Clock size={18} /> Revisions
            </button>
            <button
              aria-label="Branches"
              onClick={() => setActiveTab("branches")}
              className={`flex items-center px-3 py-2 rounded transition font-medium text-sm gap-2 ${
                activeTab === "branches"
                  ? "bg-white border border-blue-300 text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <GitBranch size={18} /> Branches
            </button>
          </div>
        </nav>

        {/* Only render the tab section the user chose */}
        {activeTab === "story" && (
          <div>
            {/* --- keep all existing story editing, chapter, popover, etc. --- */}
            {/* TITLE CRUD */}
            <div className="flex items-center mb-8 gap-1">
              {isEditingTitle ? (
                <div className="flex gap-2 items-center w-full max-w-xl">
                  <input
                    type="text"
                    value={titleInput}
                    className="border rounded px-3 py-2 text-2xl font-bold flex-1"
                    onChange={handleChangeTitle}
                    disabled={savingTitle}
                  />
                  <button
                    onClick={handleSaveTitle}
                    disabled={savingTitle}
                    className="px-2 py-1 rounded bg-blue-500 text-white text-xs font-semibold hover:bg-blue-700 transition"
                  >
                    {savingTitle ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancelEditTitle}
                    className="px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold" style={{ wordBreak: "break-word" }}>
                    <EditableText id="story-page-title">{story.title}</EditableText>
                  </h1>
                  <button
                    onClick={handleStartEditTitle}
                    className="ml-3 px-2 py-1 rounded border text-xs hover:bg-blue-50 border-blue-300"
                  >
                    Edit
                  </button>
                </>
              )}
              {/* Show Delete Story button only to authorized users */}
              {canDeleteStory && (
                <button
                  onClick={handleDeleteStory}
                  className="ml-3 px-2 py-1 rounded bg-red-500 text-white text-xs font-semibold hover:bg-red-700 transition"
                >
                  Delete Story
                </button>
              )}
            </div>

            {/* CHAPTERS CRUD */}
            <div className="space-y-6">
              {canCRUDChapters ? (
                <ChapterEditor
                  chapters={chapters}
                  onCreate={handleCreateChapter}
                  onUpdate={handleUpdateChapter}
                  onDelete={handleDeleteChapter}
                />
              ) : (
                <div className="my-6 p-4 rounded bg-gray-50 text-center text-gray-500">
                  Please log in to add or edit chapters.
                </div>
              )}
              {chapters.map((chapter) => (
                <div key={chapter.chapter_id} className="mb-10">
                  <h2 className="text-xl font-bold mb-2">{chapter.chapter_title}</h2>
                  {Array.isArray(chapter.paragraphs)
                    ? chapter.paragraphs.map((paragraph, idx) => (
                        <div key={idx} className="relative group mb-4">
                          <div className="flex items-start gap-2">
                            <p className="flex-1">{paragraph}</p>
                            <ParagraphBranchPopover
                              trigger={
                                <button
                                  className="opacity-0 group-hover:opacity-100 transition-opacity border rounded px-2 py-1 text-xs font-medium flex items-center gap-1 bg-white hover:bg-gray-100 shadow hover:shadow-md"
                                  type="button"
                                >
                                  <svg width="16" height="16" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeWidth="2" d="M6 3v6a6 6 0 006 6h6"></path><path strokeWidth="2" d="M18 21v-6a6 6 0 00-6-6H6"></path></svg>
                                  Create Branch
                                </button>
                              }
                              // Supply chapter/paragraph info to onCreateBranch for DB
                              onCreateBranch={({ branchName, paragraphs, language, metadata }) =>
                                handleCreateBranchForParagraph({
                                  branchName,
                                  paragraphs,
                                  language,
                                  metadata,
                                  chapterId: chapter.chapter_id,
                                  paragraphIndex: idx,
                                  paragraphText: paragraph,
                                })
                              }
                            />
                          </div>
                        </div>
                      ))
                    : null}
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "contributors" && <ContributorsSection />}
        {activeTab === "revisions" && <RevisionsSection />}
        {activeTab === "branches" && <BranchesSection storyId={story.story_title_id} />}
      </main>
      <CrowdlyFooter />
    </div>
  );
};

export default Story;
