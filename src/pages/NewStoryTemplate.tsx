
import React, { useState } from "react";
import { Edit, Settings, Eye, HelpCircle, CircleX, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import CrowdlyHeader from "@/components/CrowdlyHeader";
import CrowdlyFooter from "@/components/CrowdlyFooter";
import { useToast } from "@/hooks/use-toast";

const NewStoryTemplate = () => {
  const [visibilityOpen, setVisibilityOpen] = useState(false);
  const [contributorsOpen, setContributorsOpen] = useState(true);
  const [revisionsOpen, setRevisionsOpen] = useState(true);
  const [layoutOptionsOpen, setLayoutOptionsOpen] = useState(true);
  const [branchesOpen, setBranchesOpen] = useState(true);
  const [isPublished, setIsPublished] = useState(false);
  const { toast } = useToast();

  const toggleSection = (section: string) => {
    switch(section) {
      case 'visibility':
        setVisibilityOpen(!visibilityOpen);
        break;
      case 'contributors':
        setContributorsOpen(!contributorsOpen);
        break;
      case 'revisions':
        setRevisionsOpen(!revisionsOpen);
        break;
      case 'layoutOptions':
        setLayoutOptionsOpen(!layoutOptionsOpen);
        break;
      case 'branches':
        setBranchesOpen(!branchesOpen);
        break;
    }
  };

  const togglePublishStatus = () => {
    setIsPublished(!isPublished);
    toast({
      title: isPublished ? "Story unpublished" : "Story published",
      description: isPublished 
        ? "Your story is no longer visible to others" 
        : "Your story is now visible to others",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CrowdlyHeader />
      
      <div className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-8">
          {/* Story Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold">Sample story</h1>
            <h2 className="text-xl">of your life</h2>
          </div>

          {/* Story Actions */}
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <button 
                className="text-blue-500 hover:underline"
                onClick={togglePublishStatus}
              >
                {isPublished ? "unpublish" : "publish"}
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button className="text-blue-500 hover:underline">clone</button>
              <HelpCircle size={14} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1">
              <button className="text-blue-500 hover:underline">delete</button>
              <HelpCircle size={14} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-1">
              <button className="text-blue-500 hover:underline">read</button>
              <HelpCircle size={14} className="text-gray-400" />
            </div>
            <button className="text-blue-500 hover:underline">add chapter</button>
          </div>

          {/* Visibility Options */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm">
               <input type="radio" name="visibility" />
                public
              </label>             
              <button onClick={() => toggleSection('visibility')}>
                {visibilityOpen ? <CircleX size={16} /> : <HelpCircle size={16} className="text-gray-400" />}
              </button>
            </div>
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="visibility" />
                invitation only
              </label>
              <HelpCircle size={16} className="text-gray-400" />
            </div>
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="visibility" />
                private
              </label>
              <HelpCircle size={16} className="text-gray-400" />
            </div>
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="visibility" />
                read only
              </label>
              <HelpCircle size={16} className="text-gray-400" />
            </div>
          </div>

          {/* Intro Section */}
          <div className="border-b pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Intro</h3>
              <div className="flex gap-2">
                <Edit size={16} />
                <Settings size={16} />
                <Eye size={16} />
                <HelpCircle size={16} />
              </div>
            </div>

            {/* Contributors */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-500 text-sm hover:underline cursor-pointer">contributors</span>
                <div className="flex">
                  <button onClick={() => toggleSection('contributors')}>
                    {contributorsOpen ? <CircleX size={16} /> : <LayoutTemplate size={16} />}
                  </button>
                </div>
              </div>
              
              {contributorsOpen && (
                <div className="bg-white rounded-md shadow-sm border p-4">
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        { name: "soft.melody", value: 550 },
                        { name: "chill_creator", value: 550 },
                        { name: "mister.carluristo", value: 550 }
                      ].map((contributor, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-2 text-blue-500">{contributor.name}</td>
                          <td className="py-2 text-green-500">$ 5</td>
                          <td className="py-2 text-green-500">$ 5</td>
                          <td className="py-2">{contributor.value}</td>
                          <td className="py-2 text-red-500">
                            <button className="hover:underline">delete</button>
                          </td>
                          <td className="py-2 flex items-center">
                            <button className="text-blue-500 hover:underline mr-1">ban</button>
                            <HelpCircle size={14} className="text-gray-400" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div>Total in this story</div>
              <div>Approved in this story</div>
              <div>Total by the contributor</div>
            </div>
          </div>

          {/* Revisions Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-500 text-sm hover:underline cursor-pointer">revisions</span>
              <div className="flex">
                <button onClick={() => toggleSection('revisions')}>
                  {revisionsOpen ? <CircleX size={16} /> : <LayoutTemplate size={16} />}
                </button>
              </div>
            </div>
            
            {revisionsOpen && (
              <div className="bg-white rounded-md shadow-sm border p-4">
                <table className="w-full text-sm">
                  <tbody>
                    {[1, 2, 3].map((number) => (
                      <tr key={number} className="border-b last:border-0">
                        <td className="py-2 w-8">{number}</td>
                        <td className="py-2 text-blue-500">11:28</td>
                        <td className="py-2 text-center">1</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-2">
                  <button className="text-blue-500 text-sm hover:underline">Compare</button>
                  <HelpCircle size={14} className="text-gray-400 inline ml-1" />
                </div>
                <div className="bg-gray-800 text-white text-xs p-1 mt-2 inline-block rounded">
                  <span>You can compare up to 3 revisions</span>
                </div>
              </div>
            )}
          </div>

          {/* Layout Options */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <button onClick={() => toggleSection('layoutOptions')}>
                {layoutOptionsOpen ? <CircleX size={16} /> : <LayoutTemplate size={16} />}
              </button>
            </div>
            
            {layoutOptionsOpen && (
              <div className="bg-white rounded-md shadow-sm border p-4 grid grid-cols-6 gap-4">
                {["⊑", "🗔", "🗕", "⊻", "𝌐", "⊏"].map((symbol, index) => (
                  <button 
                    key={index}
                    className="border p-2 flex items-center justify-center text-xl"
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Branches Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-500 text-sm hover:underline cursor-pointer">branches</span>
              <div className="flex">
                <button onClick={() => toggleSection('branches')}>
                  {branchesOpen ? <CircleX size={16} /> : <LayoutTemplate size={16} />}
                </button>
              </div>
            </div>
            
            {branchesOpen && (
              <div className="bg-white rounded-md shadow-sm border p-4">
                <div className="text-sm">
                  <p>Some sample text</p>
                  <p>over</p>
                  <p>several line</p>
                </div>
                <div className="flex justify-end gap-2 mt-2 text-xs items-center">
                  <Edit size={14} />
                  <span>5</span>
                  <Eye size={14} />
                  <span>10</span>
                </div>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Comments</h3>
            <div className="pl-4 text-sm">
              <p className="mb-1">Some sample comment</p>
              <p className="pl-4 text-gray-600">Some reply to the sample comment</p>
            </div>
          </div>

          {/* Chapter 1 */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Chapter 1</h3>
                <p className="text-lg">The day I was conceived</p>
              </div>
              <div className="flex gap-2">
                <Edit size={16} />
                <Settings size={16} />
                <Eye size={16} />
                <HelpCircle size={16} />
              </div>
            </div>
          </div>

          {/* Chapter 2 */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Chapter 2</h3>
                <p className="text-lg">The day I was born</p>
              </div>
              <div className="flex gap-2">
                <Edit size={16} />
                <Settings size={16} />
                <Eye size={16} />
                <HelpCircle size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CrowdlyFooter />
    </div>
  );
};

export default NewStoryTemplate;
