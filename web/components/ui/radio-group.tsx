"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const radioGroupVariants = cva("flex flex-col gap-2", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row flex-wrap",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
})

export interface RadioGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof radioGroupVariants> {
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
}

export function RadioGroup({
  className,
  orientation,
  value,
  onValueChange,
  disabled,
  children,
  ...props
}: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      className={cn(radioGroupVariants({ orientation }), className)}
      data-disabled={disabled}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement<RadioGroupItemProps>(child)) {
          return React.cloneElement(child, {
            checked: child.props.value === value,
            onChange: () => onValueChange?.(child.props.value || ''),
            disabled: disabled || child.props.disabled,
          })
        }
        return child
      })}
    </div>
  )
}

export interface RadioGroupItemProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  label?: string
  description?: string
  checked?: boolean
  onChange?: () => void
}

export function RadioGroupItem({
  className,
  value,
  label,
  description,
  checked,
  onChange,
  disabled,
  ...props
}: RadioGroupItemProps) {
  return (
    <label
      className={cn(
        "relative flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
        checked
          ? "border-[var(--secondary)] bg-[var(--surface-light)]"
          : "border-[var(--border)] hover:border-[var(--text-muted)]",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      <div
        className={cn(
          "mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center",
          checked
            ? "border-[var(--secondary)] bg-[var(--secondary)]"
            : "border-[var(--text-muted)]"
        )}
      >
        {checked && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
      </div>
      <div className="flex-1">
        {label && (
          <div className="font-medium text-[var(--text)]">{label}</div>
        )}
        {description && (
          <div className="text-sm text-[var(--text-muted)]">{description}</div>
        )}
      </div>
    </label>
  )
}
