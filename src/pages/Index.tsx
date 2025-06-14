import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, BookOpen, Bookmark, Clock, Flame, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import CrowdlyHeader from "@/components/CrowdlyHeader";
import CrowdlyFooter from "@/components/CrowdlyFooter";
import EditableText from "@/components/EditableText";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface NewestStory {
  chapter_id: string;
  chapter_title: string;
  created_at: string;
  story_title: string;
  story_title_id: string;
}

const Index = () => {
  const { user, hasRole, roles } = useAuth();

  // Debug logging
  useEffect(() => {
    if (user) {
      console.log("Current user:", user?.email);
      console.log("User roles:", roles);
      console.log("Is admin?", hasRole('platform_admin'));
    } else {
      console.log("No user is logged in");
    }
  }, [user, roles, hasRole]);

  const isAdmin = user && hasRole('platform_admin');

  // State for newest stories
  const [newestStories, setNewestStories] = useState<NewestStory[]>([]);
  const [loadingStories, setLoadingStories] = useState(true);

  useEffect(() => {
    const fetchNewestStories = async () => {
      setLoadingStories(true);
      const { data, error } = await supabase
        .from("stories")
        .select(`
          chapter_id,
          chapter_title,
          created_at,
          story_title_id,
          story_title:story_title_id ( title )
        `)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Error fetching newest stories", error);
        setNewestStories([]);
      } else if (data) {
        setNewestStories(
          data.map((item: any) => ({
            chapter_id: item.chapter_id,
            chapter_title: item.chapter_title,
            created_at: item.created_at,
            story_title_id: item.story_title_id,
            story_title: item.story_title?.title || "Untitled Story",
          }))
        );
      }
      setLoadingStories(false);
    };

    fetchNewestStories();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/90">
      <CrowdlyHeader />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Admin Message */}
          {isAdmin && (
            <Card className="mb-8 border-2 border-red-500 bg-red-50 dark:bg-red-900/20">
              <CardContent className="pt-6">
                <h2 className="text-3xl font-bold mb-2 text-red-600 dark:text-red-400 animate-fade-in">
                  <EditableText id="admin-message">
                    You are logged in as platform admin
                  </EditableText>
                </h2>
              </CardContent>
            </Card>
          )}

          {/* Favorites Section */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 relative inline-block">
                <Heart className="inline-block mr-2 text-pink-500" size={24} />
                <EditableText id="main-subtitle">
                  Favorites
                </EditableText>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-transparent"></span>
              </h2>
              <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
                <p className="text-gray-600 dark:text-gray-300">
                  <EditableText id="favoriteStoriesDescriptionText">
                    Here will be your favorite stories, which you've added to your favorites. 
                    On this page they're only for you to see. The same functionality will be available in the User Profile with Visibililty options: public, private, for friends only
                  </EditableText>
                </p>
              </div>
            </div>
          </section>

          {/* Stories to Live/Experience Section */}
          <section className="mb-12">
            <div className="relative">
              <div className="flex items-center mb-6">
                <BookOpen className="mr-3 text-indigo-500" size={28} />
                <h1 className="text-3xl font-bold">
                  <EditableText id="StoriesToLiveToExperience">
                    Story(-ies) to live / to experience
                  </EditableText>
                </h1>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent -z-10 rounded-xl"></div>
            </div>

            {/* Newest Stories */}
            <Card className="mb-8 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20">
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 text-cyan-600" />
                  <EditableText id="newestStories">
                    Newest
                  </EditableText>
                </CardTitle>
                <CardDescription>Recently added stories</CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-gray-800">
                {loadingStories ? (
                  <div className="text-center text-gray-400 py-8">Loading...</div>
                ) : newestStories.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">No stories found</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {newestStories.map((story) => (
                      <Link
                        key={story.chapter_id}
                        to={`/story/${story.story_title_id}`}
                        className="block rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition p-4 shadow cursor-pointer border border-blue-100 dark:border-blue-900/20"
                        title={story.story_title}
                      >
                        <div className="font-bold text-lg mb-1 truncate">{story.story_title}</div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">{story.chapter_title}</div>
                        <div className="text-xs text-gray-400 mt-2">{new Date(story.created_at).toLocaleString()}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Most Popular Stories */}
            <Card className="mb-8 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                <CardTitle className="flex items-center">
                  <Flame className="mr-2 text-amber-600" />
                  <EditableText id="mostPopularStories">
                    Most popular
                  </EditableText>
                </CardTitle>
                <CardDescription>Trending stories loved by our community</CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Placeholder for popular stories */}
                  <div className="h-32 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center">Story preview</div>
                  <div className="h-32 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center">Story preview</div>
                  <div className="h-32 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center">Story preview</div>
                </div>
              </CardContent>
            </Card>

            {/* Most Active Stories */}
            <Card className="mb-12 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 text-green-600" />
                  <EditableText id="mostActiveStories">
                    Most active
                  </EditableText>
                </CardTitle>
                <CardDescription>Stories with ongoing activity and updates</CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Placeholder for active stories */}
                  <div className="h-32 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center">Story preview</div>
                  <div className="h-32 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center">Story preview</div>
                  <div className="h-32 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center">Story preview</div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Living/Experiencing Stories Section */}
          <section className="mb-12">
            <div className="relative">
              <div className="flex items-center mb-6">
                <Bookmark className="mr-3 text-purple-500" size={28} />
                <h1 className="text-3xl font-bold">
                  <EditableText id="LivingTheStories">
                    Living / Experiencing the story(-ies)
                  </EditableText>
                </h1>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-transparent -z-10 rounded-xl"></div>
            </div>

            <Card className="mb-8 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <p className="text-gray-600 dark:text-gray-300">
                  <EditableText id="LivingTheStoriesDescriptionText">
                    Here will be your stories which you are currently living / experiencing, which you've added. 
                    This section is only for you to see. The same functionality will be available in the User Profile with Visibililty options: public, private, for friends only
                  </EditableText>
                </p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Placeholder for current stories */}
                  <div className="h-24 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center">Current story</div>
                  <div className="h-24 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center">Current story</div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Lived/Experienced Stories Section */}
          <section>
            <div className="relative">
              <div className="flex items-center mb-6">
                <BookOpen className="mr-3 text-teal-500" size={28} />
                <h1 className="text-3xl font-bold">
                  <EditableText id="LivedThoseStories">
                    Lived / Experienced those story(-ies)
                  </EditableText>
                </h1>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-transparent to-transparent -z-10 rounded-xl"></div>
            </div>

            <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <p className="text-gray-600 dark:text-gray-300">
                  <EditableText id="LivedThoseStoriesDescriptionText">
                    Here will be your stories which you already have lived / experienced. 
                    This section is only for you to see. The same functionality will be available in the User Profile with Visibililty options: public, private, for friends only
                  </EditableText>
                </p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Placeholder for past stories */}
                  <div className="h-24 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center">Past story</div>
                  <div className="h-24 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center">Past story</div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <CrowdlyFooter />
    </div>
  );
};

export default Index;
