
import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent as RadixCollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CollapsibleContentProps {
  title: React.ReactNode; // Changed from string to ReactNode to accept JSX
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const CollapsibleContent: React.FC<CollapsibleContentProps> = ({
  title,
  children,
  defaultOpen = false,
  className
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={cn("w-full", className)}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-muted p-3 text-left font-medium hover:bg-muted/50 transition-colors [&[data-state=open]>svg]:rotate-180">
        <span className="flex items-center gap-2">
          {title}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </CollapsibleTrigger>
      <RadixCollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="p-4 pt-2">
          {children}
        </div>
      </RadixCollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleContent;
