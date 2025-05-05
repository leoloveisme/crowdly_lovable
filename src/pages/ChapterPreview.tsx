
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CrowdlyHeader from "@/components/CrowdlyHeader";
import CrowdlyFooter from "@/components/CrowdlyFooter";

const ChapterPreview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const chapterData = {
    "1": {
      title: "Chapter 1",
      subtitle: "The day I was conceived",
      content: "This is the preview content for Chapter 1. This would typically contain the full chapter content that readers can view and enjoy."
    },
    "2": {
      title: "Chapter 2",
      subtitle: "The day I was born",
      content: "This is the preview content for Chapter 2. This would typically contain the full chapter content that readers can view and enjoy."
    }
  };

  const chapter = id ? chapterData[id as keyof typeof chapterData] : null;

  return (
    <div className="min-h-screen flex flex-col">
      <CrowdlyHeader />
      
      <div className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate('/new-story-template')}
        >
          <ArrowLeft size={16} />
          Back to Story
        </Button>

        {chapter ? (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">{chapter.title}</h1>
              <h2 className="text-xl">{chapter.subtitle}</h2>
            </div>
            
            <div className="prose max-w-none">
              <p>{chapter.content}</p>
              <p className="mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="mt-4">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Chapter not found</h2>
            <p className="mt-2">The chapter you're looking for doesn't exist.</p>
          </div>
        )}
      </div>
      
      <CrowdlyFooter />
    </div>
  );
};

export default ChapterPreview;
