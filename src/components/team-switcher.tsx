import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar-nav"

interface Team {
  name: string;
  logo: React.ComponentType<{ className?: string }>;
  plan: string;
}

interface TeamSwitcherProps {
  teams?: Team[];
}

export function TeamSwitcher({ teams }: TeamSwitcherProps) {
  const sidebar = useSidebar()

  return (
    <SidebarMenu>
      {teams?.map((team, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuButton>
            <team.logo className="w-4 h-4 mr-2" />
            {team.name}
            <span className="text-xs text-muted-foreground ml-auto">{team.plan}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
