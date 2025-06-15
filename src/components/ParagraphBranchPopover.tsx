
import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus, Trash2, Save, X } from "lucide-react";
import { Label } from "@/components/ui/label";

type BranchParagraph = {
  id: string;
  text: string;
};

type Props = {
  trigger: React.ReactNode;
  onCreateBranch: (data: { branchName: string; paragraphs: string[] }) => void;
};

const ParagraphBranchPopover: React.FC<Props> = ({ trigger, onCreateBranch }) => {
  const [open, setOpen] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [paragraphs, setParagraphs] = useState<BranchParagraph[]>([
    { id: Math.random().toString(), text: "" },
  ]);
  const [editingParagraphId, setEditingParagraphId] = useState<string | null>(null);
  const [newText, setNewText] = useState("");

  // Add a new paragraph
  const handleAddParagraph = () => {
    setParagraphs([...paragraphs, { id: Math.random().toString(), text: "" }]);
    setEditingParagraphId(null);
    setNewText("");
  };

  // Delete a paragraph
  const handleDeleteParagraph = (id: string) => {
    setParagraphs(paragraphs.filter((p) => p.id !== id));
  };

  // Start editing a paragraph
  const handleEditParagraph = (id: string, text: string) => {
    setEditingParagraphId(id);
    setNewText(text);
  };

  // Save edited paragraph
  const handleSaveParagraph = (id: string) => {
    setParagraphs(paragraphs.map((p) => (p.id === id ? { ...p, text: newText } : p)));
    setEditingParagraphId(null);
    setNewText("");
  };

  // Create the branch!
  const handleCreate = () => {
    // Don’t allow empty paragraphs
    if (paragraphs.some((p) => !p.text.trim())) return;
    onCreateBranch({ branchName, paragraphs: paragraphs.map((p) => p.text) });
    setOpen(false);
    setBranchName("");
    setParagraphs([{ id: Math.random().toString(), text: "" }]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent side="right" align="end" className="max-w-lg w-96">
        <div className="mb-2">
          <Label htmlFor="branch-name" className="mb-1 font-semibold block">
            Branch Name (optional)
          </Label>
          <Input
            id="branch-name"
            value={branchName}
            placeholder="Enter branch name"
            onChange={(e) => setBranchName(e.target.value)}
            className="mb-4"
          />
        </div>

        <div>
          <Label className="mb-1 font-semibold block">Branch Paragraphs</Label>
          <div className="space-y-3">
            {paragraphs.map((p, idx) => (
              <div key={p.id} className="flex items-start gap-1">
                <span className="mt-2 mr-1 text-xs text-gray-400">{idx + 1}.</span>
                {editingParagraphId === p.id ? (
                  <Textarea
                    value={newText}
                    autoFocus
                    onChange={(e) => setNewText(e.target.value)}
                    className="min-h-[62px] flex-1"
                  />
                ) : (
                  <p className="min-h-[46px] flex-1 text-gray-900 bg-gray-50 rounded px-2 py-2">
                    {p.text || <span className="text-gray-400 italic">Empty paragraph</span>}
                  </p>
                )}
                <div className="ml-2 flex flex-col gap-1">
                  {editingParagraphId === p.id ? (
                    <>
                      <Button size="icon" variant="ghost" className="w-8 h-8" onClick={() => handleSaveParagraph(p.id)}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="w-8 h-8" onClick={() => setEditingParagraphId(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="icon" variant="ghost" className="w-8 h-8" onClick={() => handleEditParagraph(p.id, p.text)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="w-8 h-8" onClick={() => handleDeleteParagraph(p.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-3" onClick={handleAddParagraph}>
            <Plus className="mr-1 w-4 h-4" />
            Add Paragraph
          </Button>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={paragraphs.some((p) => !p.text.trim())}>
            Create Branch
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ParagraphBranchPopover;
