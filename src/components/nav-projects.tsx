import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar-nav"

interface Project {
  name: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface NavProjectsProps {
  projects?: Project[];
}

export function NavProjects({ projects }: NavProjectsProps) {
  const sidebar = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects?.map((project, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton>
              {project.icon && <project.icon className="w-4 h-4 mr-2" />}
              {project.name}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuAction>
          Add Project
        </SidebarMenuAction>
      </SidebarMenu>
    </SidebarGroup>
  )
}
