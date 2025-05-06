
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { EditableContentProvider } from "./contexts/EditableContentContext";
import Index from "./pages/Index";
import SuggestFeature from "./pages/SuggestFeature";
import FeatureSuggestions from "./pages/FeatureSuggestions";
import AccountAdministration from "./pages/AccountAdministration";
import NewStoryTemplate from "./pages/NewStoryTemplate";
import StoryforConsumers from "./pages/StoryforConsumers";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import EditingModeToggle from "./components/EditingModeToggle";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <EditableContentProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/suggest-feature" element={<SuggestFeature />} />
                <Route path="/feature-suggestions" element={<FeatureSuggestions />} />
                <Route path="/account-administration" element={<AccountAdministration />} />
                <Route path="/new-story-template" element={<NewStoryTemplate />} />
                <Route path="/story-for-consumers" element={<StoryforConsumers />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <EditingModeToggle />
            </EditableContentProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
