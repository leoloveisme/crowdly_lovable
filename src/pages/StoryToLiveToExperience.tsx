import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEditableContent } from "@/contexts/EditableContentContext";
import CrowdlyHeader from "@/components/CrowdlyHeader";
import CrowdlyFooter from "@/components/CrowdlyFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Book, Users, History, GitBranch, ChevronRight } from "lucide-react";
import RevisionComparison from "@/components/RevisionComparison";
import EditableText from "@/components/EditableText";
import ResponsiveTabsTrigger from "@/components/ResponsiveTabsTrigger";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Eye, HelpCircle, Copy, Volume, Mic, Video } from "lucide-react";

interface RevisionType {
  id: number;
  text: string;
  time: string;
}

interface ContributorType {
  id: number;
  name: string;
  words: number;
  paragraphs: number;
  chapters: number;
}

interface BranchType {
  id: number;
  title: string;
  author: string;
  chapters: number;
}

const StoryToLiveToExperience = () => {
  const { user } = useAuth();
  const { editableContent, updateEditableContent } = useEditableContent();
  const [activeSection, setActiveSection] = useState<string>("story");

  // Sample data for tables
  const contributorsData: ContributorType[] = [
    { id: 1, name: "John Doe", words: 1234, paragraphs: 12, chapters: 2 },
    { id: 2, name: "Jane Smith", words: 987, paragraphs: 8, chapters: 1 },
    { id: 3, name: "Alex Brown", words: 2345, paragraphs: 24, chapters: 4 }
  ];
  
  // Sample data for revisions - formatted for the RevisionComparison component
  const revisionsData: RevisionType[] = [
    { id: 1, text: "Title edit - Introduction", time: "2025-05-06 09:23" },
    { id: 2, text: "Content change - Chapter 2", time: "2025-05-05 14:45" },
    { id: 3, text: "New paragraph - Conclusion", time: "2025-05-04 11:30" }
  ];
  
  const branchesData: BranchType[] = [
    { id: 1, title: "Main Story", author: "John Doe", chapters: 5 },
    { id: 2, title: "Alternative Ending", author: "Jane Smith", chapters: 2 },
    { id: 3, title: "Character Development", author: "Alex Brown", chapters: 3 }
  ];

  // Section toggle handler
  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? "" : section);
  };

  const userName = user?.email?.split("@")[0] || "Guest";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <CrowdlyHeader />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          {/* Story Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              <EditableText id="story-title">STORY TO LIVE TO EXPERIENCE</EditableText>
            </h1>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Left sidebar */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      <EditableText id="chapters-title">Chapters</EditableText>
                    </CardTitle>
                    
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
                            <Volume className="mr-2 h-4 w-4" />
                            <EditableText id="generate-audio-menu-item">Generate Audio</EditableText>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center">
                            <Mic className="mr-2 h-4 w-4" />
                            <EditableText id="record-audio-menu-item">Record Audio</EditableText>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center">
                            <Video className="mr-2 h-4 w-4" />
                            <EditableText id="record-video-menu-item">Record Video</EditableText>
                          </DropdownMenuItem>
                           <DropdownMenuItem className="flex items-center">
                            <Video className="mr-2 h-4 w-4" />
                            <EditableText id="generate-video-menu-item">Generate Video</EditableText>
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
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {/* Add your chapter list here */}
                    <div>Chapter 1</div>
                    <div>Chapter 2</div>
                    <div>Chapter 3</div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main content area */}
            <div className="md:col-span-3">
              <Tabs defaultValue="story" className="w-full">
                <div className="w-full mb-6 overflow-x-auto">
                  <div className="flex border-b">
                    <ResponsiveTabsTrigger 
                      value="story" 
                      icon={<Book className="h-4 w-4" />}
                      text={<EditableText id="story-tab">Story</EditableText>}
                      onClick={() => toggleSection('story')}
                      active={activeSection === 'story' || activeSection === ''}
                    />
                    <ResponsiveTabsTrigger 
                      value="contributors" 
                      icon={<Users className="h-4 w-4" />} 
                      text={<EditableText id="contributors-tab">Contributors</EditableText>}
                      onClick={() => toggleSection('contributors')}
                      active={activeSection === 'contributors'}
                    />
                    <ResponsiveTabsTrigger 
                      value="revisions" 
                      icon={<History className="h-4 w-4" />} 
                      text={<EditableText id="revisions-tab">Revisions</EditableText>}
                      onClick={() => toggleSection('revisions')}
                      active={activeSection === 'revisions'}
                    />
                    <ResponsiveTabsTrigger 
                      value="branches" 
                      icon={<GitBranch className="h-4 w-4" />} 
                      text={<EditableText id="branches-tab">Branches</EditableText>}
                      onClick={() => toggleSection('branches')}
                      active={activeSection === 'branches'}
                    />
                  </div>
                </div>
                
                {/* Story Content */}
                {activeSection === 'story' || activeSection === '' ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <EditableText id="story-content-title">Story Content</EditableText>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        <EditableText id="story-paragraph-1">
                          This is where the story content will go. You can add multiple paragraphs and format them as needed.
                        </EditableText>
                      </p>
                      <p>
                        <EditableText id="story-paragraph-2">
                          Feel free to use EditableText components to allow users to modify the content directly.
                        </EditableText>
                      </p>
                    </CardContent>
                  </Card>
                ) : null}
                
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
                
                {/* Revisions Content - Replace with RevisionComparison component */}
                {activeSection === 'revisions' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <EditableText id="revisions-title">Revisions</EditableText>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RevisionComparison revisions={revisionsData} />
                    </CardContent>
                  </Card>
                )}
                
                {/* Branches Content */}
                {activeSection === 'branches' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <EditableText id="branches-title">Branches</EditableText>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>
                              <EditableText id="branch-title">Title</EditableText>
                            </TableHead>
                            <TableHead>
                              <EditableText id="branch-author">Author</EditableText>
                            </TableHead>
                            <TableHead>
                              <EditableText id="branch-chapters">Chapters</EditableText>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {branchesData.map((branch) => (
                            <TableRow key={branch.id}>
                              <TableCell className="font-medium">{branch.title}</TableCell>
                              <TableCell>{branch.author}</TableCell>
                              <TableCell>{branch.chapters}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <CrowdlyFooter />
    </div>
  );
};

export default StoryToLiveToExperience;
