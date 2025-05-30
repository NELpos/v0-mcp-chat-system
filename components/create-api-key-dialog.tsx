"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Key, Shield, Clock } from "lucide-react"
import { format } from "date-fns"
import type { CreateAPIKeyRequest } from "@/types/api-key"

interface CreateAPIKeyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateKey: (keyData: CreateAPIKeyRequest) => void
}

const availablePermissions = [
  { id: "read", label: "Read", description: "View data and resources" },
  { id: "write", label: "Write", description: "Create and modify data" },
  { id: "admin", label: "Admin", description: "Full administrative access" },
]

export function CreateAPIKeyDialog({ open, onOpenChange, onCreateKey }: CreateAPIKeyDialogProps) {
  const [formData, setFormData] = useState<CreateAPIKeyRequest>({
    name: "",
    description: "",
    permissions: ["read"],
  })
  const [expiryDate, setExpiryDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onCreateKey({
      ...formData,
      expiresAt: expiryDate,
    })

    // Reset form
    setFormData({
      name: "",
      description: "",
      permissions: ["read"],
    })
    setExpiryDate(undefined)
    setIsSubmitting(false)
  }

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked ? [...prev.permissions, permissionId] : prev.permissions.filter((p) => p !== permissionId),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Create New API Key
          </DialogTitle>
          <DialogDescription>
            Generate a new API key for your application. The key will be shown only once and automatically copied to
            your clipboard.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Production API, Development Key"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this API key will be used for"
              rows={3}
              required
            />
          </div>

          {/* Permissions */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Permissions
            </Label>
            <div className="space-y-3">
              {availablePermissions.map((permission) => (
                <div key={permission.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={permission.id}
                    checked={formData.permissions.includes(permission.id)}
                    onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={permission.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {permission.label}
                    </label>
                    <p className="text-xs text-muted-foreground">{permission.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Expiry Date (Optional)
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, "PPP") : "Select expiry date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={expiryDate}
                  onSelect={setExpiryDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Leave empty for a key that never expires. Expired keys are automatically deactivated.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || formData.permissions.length === 0}>
              {isSubmitting ? "Creating..." : "Create API Key"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
