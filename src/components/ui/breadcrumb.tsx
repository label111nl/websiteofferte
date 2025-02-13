import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Breadcrumb({ className, children, ...props }: BreadcrumbProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)} {...props}>
      {children}
    </div>
  )
}

export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLDivElement> {
  href?: string
  active?: boolean
}

export function BreadcrumbItem({ className, href, active, children, ...props }: BreadcrumbItemProps) {
  return (
    <div className="flex items-center space-x-2">
      <div
        className={cn(
          "text-sm",
          active ? "text-foreground font-medium" : "text-muted-foreground",
          className
        )}
        {...props}
      >
        {href ? <a href={href}>{children}</a> : children}
      </div>
      {!active && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
    </div>
  )
}

export interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export function BreadcrumbLink({ className, href, ...props }: BreadcrumbLinkProps) {
  return <a href={href} className={cn("text-sm font-medium hover:underline", className)} {...props} />
}

export function BreadcrumbList({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <nav className={cn("flex", className)} aria-label="breadcrumb" {...props} />
}

export function BreadcrumbPage({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("text-sm font-medium text-muted-foreground", className)} aria-current="page" {...props} />
}

export function BreadcrumbSeparator({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("mx-2 text-muted-foreground", className)} aria-hidden="true" {...props}>
      /
    </span>
  )
} 