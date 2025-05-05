
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
  const [lastSaveAttempt, setLastSaveAttempt] = useState<string | null>(null);

  // Handle language change
  const handleLanguageChange = (language: string) => {
    console.log(`Language changed to: ${language}`);
    
    // Clear existing content
    setContents({});
    
    // Set the new language
    setCurrentLanguage(language);
    
    // Trigger a content refetch
    setShouldFetchContent(true);
    
    // Display toast notification about language change
    toast({
      title: "Language changed",
      description: `Content is now displayed in ${language}`,
      duration: 3000,
    });
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
  }, [currentPath, currentLanguage, shouldFetchContent]);

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

      // Create a unique identifier for this save attempt
      const saveKey = `${elementId}-${currentLanguage}-${Date.now()}`;
      setLastSaveAttempt(saveKey);
      
      console.log(`Saving content for ${elementId} in ${currentLanguage}`);

      // First, try to update assuming the record exists
      const { data: updateData, error: updateError } = await supabase
        .from('editable_content')
        .update({
          content: contentData.content,
          updated_by: user?.id,
          updated_at: new Date().toISOString()
        })
        .eq('page_path', currentPath)
        .eq('element_id', elementId)
        .eq('language', currentLanguage)
        .select();
      
      // If there was no error but no rows were affected (nothing updated)
      if (!updateError && (!updateData || updateData.length === 0)) {
        console.log('No existing record found, inserting new record');
        
        // Try to insert a new record
        const { error: insertError } = await supabase
          .from('editable_content')
          .insert({
            page_path: currentPath,
            element_id: elementId,
            content: contentData.content,
            original_content: contentData.original,
            updated_by: user?.id,
            language: currentLanguage
          });

        if (insertError) {
          // If insert fails with duplicate key, it means another session just created it
          if (insertError.code === '23505') {
            console.log('Duplicate key detected - concurrent edit detected');
            
            // Wait a moment and retry as update
            setTimeout(async () => {
              if (saveKey !== lastSaveAttempt) return; // Don't retry if there's been a newer save attempt
              
              const { error: retryError } = await supabase
                .from('editable_content')
                .update({
                  content: contentData.content,
                  updated_by: user?.id,
                  updated_at: new Date().toISOString()
                })
                .eq('page_path', currentPath)
                .eq('element_id', elementId)
                .eq('language', currentLanguage);
              
              if (retryError) {
                console.error('Error in retry update:', retryError);
                toast({
                  title: "Error saving content",
                  description: "Could not save after retry. Please try again.",
                  variant: "destructive"
                });
                return;
              }
              
              // Turn off editing for this element after successful retry
              setContents(prev => ({
                ...prev,
                [elementId]: {
                  ...prev[elementId],
                  isEditing: false
                }
              }));

              toast({
                title: "Content saved",
                description: `Your changes have been saved successfully in ${currentLanguage} (after retry)`,
              });
              
              // Refresh content from database to ensure we have the latest
              setShouldFetchContent(true);
            }, 500);
            
            return;
          } else {
            console.error('Error inserting content:', insertError);
            toast({
              title: "Error saving content",
              description: insertError.message,
              variant: "destructive"
            });
            return;
          }
        }
      } else if (updateError) {
        console.error('Error updating content:', updateError);
        toast({
          title: "Error saving content",
          description: updateError.message,
          variant: "destructive"
        });
        return;
      }

      // Turn off editing for this element
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
      
      // Always refresh content after successful save to ensure we have the latest
      setShouldFetchContent(true);
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
    setCurrentLanguage: handleLanguageChange
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
