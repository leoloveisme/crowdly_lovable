
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";

interface EditableContent {
  [key: string]: {
    content: string;
    original: string;
    isEditing: boolean;
  };
}

interface EditableContentContextType {
  contents: EditableContent;
  isEditingEnabled: boolean;
  toggleEditingMode: () => void;
  startEditing: (elementId: string, content: string, original: string) => void;
  updateContent: (elementId: string, content: string) => void;
  saveContent: (elementId: string) => Promise<void>;
  cancelEditing: (elementId: string) => void;
  isAdmin: boolean;
  currentLanguage: string;
  setCurrentLanguage: (language: string) => void;
}

const EditableContentContext = createContext<EditableContentContextType | undefined>(undefined);

export const EditableContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contents, setContents] = useState<EditableContent>({});
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>("English");
  const { user, hasRole } = useAuth();
  const location = useLocation();
  const isAdmin = user !== null && hasRole('platform_admin');
  const currentPath = location.pathname;

  // Create a tracking variable for language changes
  const [shouldFetchContent, setShouldFetchContent] = useState(true);

  // Handle language change
  const handleLanguageChange = (language: string) => {
    console.log(`Language changed to: ${language}`);
    // Set the new language
    setCurrentLanguage(language);
    // Clear existing content
    setContents({});
    // Trigger a content refetch
    setShouldFetchContent(true);
  };

  // Fetch existing content from the database based on current path and language
  useEffect(() => {
    const fetchEditableContent = async () => {
      if (!currentPath || !shouldFetchContent) return;

      try {
        console.log(`Fetching content for path: ${currentPath}, language: ${currentLanguage}`);
        const { data, error } = await supabase
          .from('editable_content')
          .select('*')
          .eq('page_path', currentPath)
          .eq('language', currentLanguage);

        if (error) {
          console.error('Error fetching editable content:', error);
          return;
        }

        if (data) {
          console.log(`Retrieved ${data.length} content items for ${currentLanguage}`, data);
          const contentMap: EditableContent = {};
          data.forEach(item => {
            contentMap[item.element_id] = {
              content: item.content,
              original: item.original_content || item.content,
              isEditing: false
            };
          });
          setContents(contentMap);
          // Reset the fetch flag after successful fetch
          setShouldFetchContent(false);
        }
      } catch (error) {
        console.error('Error in fetchEditableContent:', error);
      }
    };

    fetchEditableContent();
  }, [currentPath, currentLanguage, isAdmin, shouldFetchContent]);

  const toggleEditingMode = () => {
    if (!isAdmin) return;
    
    setIsEditingEnabled(prev => !prev);
    
    // Exit all editing states when disabling editing mode
    if (isEditingEnabled) {
      setContents(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          updated[key].isEditing = false;
        });
        return updated;
      });
    }

    toast({
      title: isEditingEnabled ? "Editing mode disabled" : "Editing mode enabled",
      description: isEditingEnabled 
        ? "Content is now in view-only mode" 
        : "You can now edit content by clicking on text elements",
    });
  };

  const startEditing = (elementId: string, content: string, original: string) => {
    if (!isAdmin || !isEditingEnabled) return;
    
    setContents(prev => ({
      ...prev,
      [elementId]: {
        content,
        original: prev[elementId]?.original || original,
        isEditing: true
      }
    }));
  };

  const updateContent = (elementId: string, content: string) => {
    if (!isAdmin) return;
    
    setContents(prev => ({
      ...prev,
      [elementId]: {
        ...prev[elementId],
        content
      }
    }));
  };

  const saveContent = async (elementId: string) => {
    if (!isAdmin || !currentPath) return;
    
    try {
      const contentData = contents[elementId];
      if (!contentData) return;

      console.log(`Saving content for ${elementId} in ${currentLanguage}`);

      // First, try to get the EXACT record with element_id, page_path and language combination
      const { data: existingData, error: fetchError } = await supabase
        .from('editable_content')
        .select('*')
        .eq('page_path', currentPath)
        .eq('element_id', elementId)
        .eq('language', currentLanguage)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking existing content:', fetchError);
        toast({
          title: "Error saving content",
          description: fetchError.message,
          variant: "destructive"
        });
        return;
      }

      let result;
      
      if (existingData) {
        // Update existing record
        console.log('Updating existing content record:', existingData.id);
        result = await supabase
          .from('editable_content')
          .update({
            content: contentData.content,
            updated_by: user?.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
      } else {
        // Before inserting, double check that there isn't already a record with this combination
        // This helps avoid race conditions or duplicate entries
        const { count, error: countError } = await supabase
          .from('editable_content')
          .select('*', { count: 'exact', head: true })
          .eq('page_path', currentPath)
          .eq('element_id', elementId)
          .eq('language', currentLanguage);
          
        if (countError) {
          console.error('Error checking for duplicates:', countError);
          return;
        }
        
        if (count && count > 0) {
          // If we found a record but didn't get it in our first query (race condition)
          // Retry the fetch
          console.log('Record exists but wasn\'t returned in first query, retrying fetch');
          setShouldFetchContent(true);
          
          toast({
            title: "Cannot save content",
            description: "This content already exists. The page will refresh to show the current version.",
            variant: "destructive"
          });
          return;
        }
        
        // If no record exists, insert new record
        console.log('Inserting new content record');
        result = await supabase
          .from('editable_content')
          .insert({
            page_path: currentPath,
            element_id: elementId,
            content: contentData.content,
            original_content: contentData.original,
            updated_by: user?.id,
            language: currentLanguage
          });
      }

      if (result.error) {
        console.error('Error saving content:', result.error);
        
        // Special handling for duplicate key errors
        if (result.error.code === '23505') {
          toast({
            title: "Error saving content",
            description: "This content already exists. The page will refresh to show the current version.",
            variant: "destructive"
          });
          // Force refresh content from database
          setShouldFetchContent(true);
        } else {
          toast({
            title: "Error saving content",
            description: result.error.message,
            variant: "destructive"
          });
        }
        return;
      }

      console.log('Content saved successfully');
      
      // Update local state, turn off editing for this element
      setContents(prev => ({
        ...prev,
        [elementId]: {
          ...prev[elementId],
          isEditing: false
        }
      }));

      toast({
        title: "Content saved",
        description: `Your changes have been saved successfully in ${currentLanguage}`,
      });
    } catch (error) {
      console.error('Error in saveContent:', error);
      toast({
        title: "Error saving content",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const cancelEditing = (elementId: string) => {
    if (!isAdmin) return;
    
    setContents(prev => {
      const elementData = prev[elementId];
      if (!elementData) return prev;
      
      return {
        ...prev,
        [elementId]: {
          ...elementData,
          content: elementData.content, // Keep the current content
          isEditing: false
        }
      };
    });
  };

  const value = {
    contents,
    isEditingEnabled,
    toggleEditingMode,
    startEditing,
    updateContent,
    saveContent,
    cancelEditing,
    isAdmin,
    currentLanguage,
    setCurrentLanguage: handleLanguageChange // Use our new handler instead of direct state setter
  };

  return (
    <EditableContentContext.Provider value={value}>
      {children}
    </EditableContentContext.Provider>
  );
};

export const useEditableContent = () => {
  const context = useContext(EditableContentContext);
  if (context === undefined) {
    throw new Error("useEditableContent must be used within an EditableContentProvider");
  }
  return context;
};
