import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  error?: string
}

export function FormField({ className, label, error, children, ...props }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && <label className="text-sm font-medium">{label}</label>}
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
} 