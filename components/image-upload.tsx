"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, X, ImageIcon, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  className?: string
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return "Please upload a valid image file (JPEG, PNG, or WebP)"
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return "Image size must be less than 5MB"
    }

    return null
  }

  const processImage = useCallback(
    async (file: File) => {
      setIsLoading(true)
      setError("")

      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        setIsLoading(false)
        return
      }

      try {
        // Create image preview
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          onChange(result)
          setIsLoading(false)
        }
        reader.onerror = () => {
          setError("Failed to read image file")
          setIsLoading(false)
        }
        reader.readAsDataURL(file)
      } catch (err) {
        setError("Failed to process image")
        setIsLoading(false)
      }
    },
    [onChange],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processImage(file)
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        processImage(file)
      }
    },
    [processImage],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeImage = () => {
    onChange("")
    setError("")
  }

  return (
    <div className={className}>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {value ? (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="relative group">
              <img
                src={value || "/placeholder.svg"}
                alt="Product preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <Button variant="destructive" size="sm" onClick={removeImage} className="gap-2">
                  <X className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={`border-2 border-dashed transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">Processing image...</p>
                </>
              ) : (
                <>
                  <div className="p-4 bg-muted rounded-full">
                    {isDragging ? (
                      <Upload className="h-8 w-8 text-primary" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{isDragging ? "Drop image here" : "Upload product image"}</p>
                    <p className="text-xs text-muted-foreground">Drag and drop or click to browse</p>
                    <p className="text-xs text-muted-foreground">Supports JPEG, PNG, WebP (max 5MB)</p>
                  </div>
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span>Browse Files</span>
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
