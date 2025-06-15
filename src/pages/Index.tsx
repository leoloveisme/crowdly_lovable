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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-sky-100 to-white dark:from-background dark:via-background/70 dark:to-background/90">
      <CrowdlyHeader />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative mb-16">
          <div className="absolute inset-0 -z-10">
            <div className="h-80 bg-gradient-to-r from-pink-200/60 via-white/60 to-sky-200/60 rounded-b-3xl blur-[2px]"></div>
            {/* Optionally place an image (overlayed subtle hero graphic) */}
            <img 
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=900&q=80"
              alt=""
              className="absolute right-0 bottom-0 w-80 h-56 object-cover opacity-30 hidden md:block pointer-events-none select-none rounded-2xl shadow-lg"
              draggable="false"
              style={{zIndex:1}}
            />
          </div>
          <div className="container mx-auto px-4 pt-14 pb-8 flex flex-col md:flex-row items-center md:items-end gap-8 relative">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-3 flex flex-wrap items-center gap-3 animate-fade-in">
                <span className="bg-gradient-to-r from-pink-400 via-indigo-500 to-blue-700 bg-clip-text text-transparent">
                  Crowdly
                </span>
                <span className="text-lg md:text-xl font-normal text-gray-600 dark:text-gray-300 pl-2">
                  <EditableText id="platform-slogan">Crowd-created stories that branch & grow—Experience, Create, Collaborate.</EditableText>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-7 animate-fade-in">
                <EditableText id="main-hero-description">
                  Discover, create, and live amazing branching stories—rich in text, audio, and video—collaboratively built by the crowd, for the world. Versioned, multilingual, and unlimited.
                </EditableText>
              </p>
              {/* Create New Story Link - Now for EVERYONE, different link depending on logged in */}
              <div className="mb-4 animate-fade-in">
                <Link
                  to={user ? "/new-story-template" : "/login"}
                  className="group inline-flex items-center px-8 py-3 text-lg font-semibold rounded-2xl shadow-none focus:outline-none relative"
                  style={{
                    background: "linear-gradient(to right, #ff43b0 0%, #6c63ff 100%)",
                  }}
                >
                  {/* Bottom pink shadow effect */}
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      boxShadow: "0 6px 0 0 #f9a8d4", // tailwind's pink-300
                      opacity: "0.44",
                      zIndex: 0,
                    }}
                  ></span>
                  <span className="flex items-center z-10 relative text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-3"
                      width="28"
                      height="28"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" stroke="white" strokeWidth="2" />
                      <path d="M16 3v4M8 3v4" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span>
                      <EditableText id="hero-create-new-story">
                        Create a New Amazing Story
                      </EditableText>
                    </span>
                  </span>
                </Link>
              </div>
            </div>
            {/* Hero Illustrative Side */}
            <div className="hidden md:block flex-1 relative">
              <div className="absolute top-2 right-4 w-60 h-60 rounded-full bg-gradient-to-tr from-indigo-300 via-pink-200 to-sky-100 opacity-70 blur-[40px]"></div>
              {/* Optionally you can place a preview of a "story card" style here in the future */}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          {/* Admin Message */}
          {isAdmin && (
            <Card className="mb-10 border-2 border-red-500 bg-red-50 dark:bg-red-900/20 animate-fade-in">
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
          <section className="mb-14">
            <div className="rounded-2xl shadow-lg bg-gradient-to-r from-pink-50 via-white to-indigo-50 dark:bg-gradient-to-br dark:from-indigo-900/80 dark:to-pink-900/60 mb-7 px-5 py-7 relative animate-fade-in">
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Heart className="text-pink-500" size={26} />
                <EditableText id="main-subtitle">Favorites</EditableText>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
                <EditableText id="favoriteStoriesDescriptionText">
                  Here will be your favorite stories, which you've added to your favorites. 
                  On this page they're only for you to see. The same functionality will be available in the User Profile with Visibililty options: public, private, for friends only
                </EditableText>
              </p>
            </div>
          </section>

          {/* Animated Section Separators */}
          <div className="my-12 flex items-center gap-2">
            <span className="flex-grow h-0.5 bg-gradient-to-r from-pink-400/50 to-indigo-400/10 rounded"></span>
            <span className="text-lg text-gray-600 dark:text-gray-300 font-semibold shrink-0 animate-fade-in">
              <BookOpen className="inline-block mr-1 text-indigo-500" size={22} />
              <EditableText id="StoriesToLiveToExperience">
                Story(-ies) to live / to experience
              </EditableText>
            </span>
            <span className="flex-grow h-0.5 bg-gradient-to-l from-pink-400/50 to-indigo-400/10 rounded"></span>
          </div>

          {/* Stories to Live/Experience Section */}
          <section className="mb-16">
            {/* Newest Stories */}
            <Card className="mb-8 overflow-hidden hover-scale shadow-lg animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/30 rounded-t-xl">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="text-cyan-600" />
                  <EditableText id="newestStories">Newest</EditableText>
                </CardTitle>
                <CardDescription>Recently added stories</CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-gray-800 rounded-b-xl">
                {loadingStories ? (
                  <div className="text-center text-gray-400 py-8">Loading...</div>
                ) : newestStories.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">No stories found</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {newestStories.map((story) => (
                      <Link
                        key={story.chapter_id}
                        to={`/story/${story.story_title_id}`}
                        className="block rounded-lg bg-white dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition p-5 shadow ring-1 ring-indigo-100 dark:ring-indigo-900/30 hover-scale group"
                        title={story.story_title}
                      >
                        <div className="font-bold text-lg mb-1 truncate text-indigo-700 dark:text-indigo-100 group-hover:underline">{story.story_title}</div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">{story.chapter_title}</div>
                        <div className="text-xs text-gray-400 mt-2">{new Date(story.created_at).toLocaleString()}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Most Popular Stories */}
            <Card className="mb-8 overflow-hidden hover-scale shadow-lg animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/18 rounded-t-xl">
                <CardTitle className="flex items-center gap-2">
                  <Flame className="text-amber-600" />
                  <EditableText id="mostPopularStories">Most popular</EditableText>
                </CardTitle>
                <CardDescription>Trending stories loved by our community</CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-gray-800 rounded-b-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Placeholder for popular stories */}
                  <div className="h-32 rounded-lg bg-yellow-100 dark:bg-orange-900/20 flex items-center justify-center text-yellow-700 dark:text-yellow-300 font-semibold">Story preview</div>
                  <div className="h-32 rounded-lg bg-yellow-100 dark:bg-orange-900/20 flex items-center justify-center text-yellow-700 dark:text-yellow-300 font-semibold">Story preview</div>
                  <div className="h-32 rounded-lg bg-yellow-100 dark:bg-orange-900/20 flex items-center justify-center text-yellow-700 dark:text-yellow-300 font-semibold">Story preview</div>
                </div>
              </CardContent>
            </Card>

            {/* Most Active Stories */}
            <Card className="mb-16 overflow-hidden hover-scale shadow-lg animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-t-xl">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="text-green-600" />
                  <EditableText id="mostActiveStories">Most active</EditableText>
                </CardTitle>
                <CardDescription>Stories with ongoing activity and updates</CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-gray-800 rounded-b-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Placeholder for active stories */}
                  <div className="h-32 rounded-lg bg-green-100 dark:bg-emerald-900/20 flex items-center justify-center text-green-700 dark:text-green-300 font-semibold">Story preview</div>
                  <div className="h-32 rounded-lg bg-green-100 dark:bg-emerald-900/20 flex items-center justify-center text-green-700 dark:text-green-300 font-semibold">Story preview</div>
                  <div className="h-32 rounded-lg bg-green-100 dark:bg-emerald-900/20 flex items-center justify-center text-green-700 dark:text-green-300 font-semibold">Story preview</div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Living/Experiencing Stories Section */}
          <div className="my-12 flex items-center gap-2">
            <span className="flex-grow h-0.5 bg-gradient-to-r from-purple-400/60 to-sky-300/10 rounded"></span>
            <span className="text-lg text-purple-700 dark:text-purple-100 font-semibold shrink-0 animate-fade-in">
              <Bookmark className="inline-block mr-1 text-purple-500" size={22} />
              <EditableText id="LivingTheStories">
                Living / Experiencing the story(-ies)
              </EditableText>
            </span>
            <span className="flex-grow h-0.5 bg-gradient-to-l from-purple-400/60 to-sky-300/10 rounded"></span>
          </div>

          <section className="mb-16">
            <Card className="bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-shadow duration-300 animate-fade-in">
              <CardContent className="p-6">
                <p className="text-gray-600 dark:text-gray-300">
                  <EditableText id="LivingTheStoriesDescriptionText">
                    Here will be your stories which you are currently living / experiencing, which you've added. 
                    This section is only for you to see. The same functionality will be available in the User Profile with Visibililty options: public, private, for friends only
                  </EditableText>
                </p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Placeholder for current stories */}
                  <div className="h-24 rounded-md bg-gradient-to-r from-fuchsia-100 to-purple-100 dark:from-fuchsia-900/20 dark:to-purple-900/20 flex items-center justify-center text-purple-900 dark:text-purple-100 font-semibold">Current story</div>
                  <div className="h-24 rounded-md bg-gradient-to-r from-fuchsia-100 to-purple-100 dark:from-fuchsia-900/20 dark:to-purple-900/20 flex items-center justify-center text-purple-900 dark:text-purple-100 font-semibold">Current story</div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Lived/Experienced Stories Section */}
          <div className="my-12 flex items-center gap-2">
            <span className="flex-grow h-0.5 bg-gradient-to-r from-teal-400/60 to-sky-300/10 rounded"></span>
            <span className="text-lg text-teal-700 dark:text-teal-100 font-semibold shrink-0 animate-fade-in">
              <BookOpen className="inline-block mr-1 text-teal-500" size={22} />
              <EditableText id="LivedThoseStories">
                Lived / Experienced those story(-ies)
              </EditableText>
            </span>
            <span className="flex-grow h-0.5 bg-gradient-to-l from-teal-400/60 to-sky-300/10 rounded"></span>
          </div>
          <section className="mb-12">
            <Card className="bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-shadow duration-300 animate-fade-in">
              <CardContent className="p-6">
                <p className="text-gray-600 dark:text-gray-300">
                  <EditableText id="LivedThoseStoriesDescriptionText">
                    Here will be your stories which you already have lived / experienced. 
                    This section is only for you to see. The same functionality will be available in the User Profile with Visibililty options: public, private, for friends only
                  </EditableText>
                </p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Placeholder for past stories */}
                  <div className="h-24 rounded-md bg-gradient-to-r from-cyan-100 to-teal-100 dark:from-cyan-900/20 dark:to-teal-900/20 flex items-center justify-center text-teal-900 dark:text-teal-100 font-semibold">Past story</div>
                  <div className="h-24 rounded-md bg-gradient-to-r from-cyan-100 to-teal-100 dark:from-cyan-900/20 dark:to-teal-900/20 flex items-center justify-center text-teal-900 dark:text-teal-100 font-semibold">Past story</div>
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
