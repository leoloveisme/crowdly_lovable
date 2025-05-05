
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SuggestFeature from "./pages/SuggestFeature";
import AccountAdministration from "./pages/AccountAdministration";
import NewStoryTemplate from "./pages/NewStoryTemplate";
import NotFound from "./pages/NotFound";
import ChapterPreview from "./pages/ChapterPreview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/suggest-feature" element={<SuggestFeature />} />
          <Route path="/account-administration" element={<AccountAdministration />} />
          <Route path="/new-story-template" element={<NewStoryTemplate />} />
          <Route path="/chapter/:id" element={<ChapterPreview />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
