
import * as React from "react";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSidebar } from "./context";

export const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8 bg-sidebar-accent/50 hover:bg-sidebar-accent", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft strokeWidth={1.5} />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
});

SidebarTrigger.displayName = "SidebarTrigger";
