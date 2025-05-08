
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ResponsiveTabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsTrigger> {
  icon: React.ReactNode;
  text: string;
}

const ResponsiveTabsTrigger = ({ 
  icon, 
  text, 
  className,
  ...props 
}: ResponsiveTabsTriggerProps) => {
  const isMobile = useIsMobile();
  
  return (
    <TabsTrigger 
      className={cn("flex items-center gap-1", className)} 
      {...props}
    >
      {icon}
      {!isMobile && <span>{text}</span>}
    </TabsTrigger>
  );
};

export default ResponsiveTabsTrigger;
