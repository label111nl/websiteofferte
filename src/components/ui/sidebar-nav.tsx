import * as React from "react"
import { cn } from "@/lib/utils"

export function SidebarGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-3", className)} {...props} />
}

export function SidebarGroupLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-xs font-semibold uppercase", className)} {...props} />
}

export function SidebarMenu({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1", className)} {...props} />
}

export function SidebarMenuButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "w-full flex items-center py-2 px-3 text-sm font-medium rounded-md hover:bg-accent",
        className
      )}
      {...props}
    />
  )
}

export function SidebarMenuItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-3 py-2", className)} {...props} />
}

export function SidebarMenuSub({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pl-6 space-y-1", className)} {...props} />
}

export function SidebarMenuSubButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "w-full flex items-center py-2 px-3 text-sm rounded-md hover:bg-accent",
        className
      )}
      {...props}
    />
  )
}

export function SidebarMenuSubItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-3 py-2", className)} {...props} />
}

export function SidebarMenuAction({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "w-full flex items-center justify-between py-2 px-3 text-sm rounded-md hover:bg-accent",
        className
      )}
      {...props}
    />
  )
}

export function useSidebar() {
  const [isOpen, setIsOpen] = React.useState(true)
  return {
    isOpen,
    toggle: () => setIsOpen(!isOpen)
  }
} 