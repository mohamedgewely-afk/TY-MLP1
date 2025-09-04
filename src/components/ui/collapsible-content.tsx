import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent as RadixCollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface CollapsibleContentProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  /** Optional: control the open state from parent */
  open?: boolean;
  /** Optional: notify parent when open state changes */
  onOpenChange?: (open: boolean) => void;
}

const CollapsibleContent: React.FC<CollapsibleContentProps> = ({
  title,
  children,
  defaultOpen = false,
  className,
  open: controlledOpen,
  onOpenChange,
}) => {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  return (
    <Collapsible open={open} onOpenChange={handleOpenChange} className={cn("w-full", className)}>
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center justify-between rounded-lg border border-muted p-3 text-left font-medium",
          "hover:bg-muted/50 transition-colors",
          "[&[data-state=open]>svg]:rotate-180"
        )}
      >
        <span className="flex items-center gap-2">{title}</span>
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </CollapsibleTrigger>

      <RadixCollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="p-4 pt-2">{children}</div>
      </RadixCollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleContent;
