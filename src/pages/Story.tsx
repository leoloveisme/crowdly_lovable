
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import CrowdlyHeader from "@/components/CrowdlyHeader";
import CrowdlyFooter from "@/components/CrowdlyFooter";
import EditableText from "@/components/EditableText";

const Story = () => {
  const { story_id } = useParams();
  const [story, setStory] = useState<{ title: string } | null>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      // Fetch story title
      const { data: titleRow, error: titleError } = await supabase
        .from("story_title")
        .select()
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

    if (story_id) {
      fetchStory();
    }
  }, [story_id]);

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

  return (
    <div className="flex flex-col min-h-screen">
      <CrowdlyHeader />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">
          <EditableText id="story-page-title">{story.title}</EditableText>
        </h1>
        <div>
          {chapters.length === 0 ? (
            <p className="text-gray-500">No chapters yet.</p>
          ) : (
            chapters.map((ch, idx) => (
              <div key={ch.chapter_id} className="mb-8 border-b pb-4">
                <h2 className="text-xl font-semibold mb-2">
                  <EditableText id={`chapter-title-${ch.chapter_id}`}>{ch.chapter_title}</EditableText>
                </h2>
                {Array.isArray(ch.paragraphs) && ch.paragraphs.length > 0 ? (
                  <div className="space-y-2">
                    {ch.paragraphs.map((para: string, pidx: number) => (
                      <p key={pidx} className="text-base">
                        <EditableText id={`chapter-${ch.chapter_id}-para-${pidx}`}>{para}</EditableText>
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No paragraphs.</p>
                )}
              </div>
            ))
          )}
        </div>
      </main>
      <CrowdlyFooter />
    </div>
  );
};

export default Story;
