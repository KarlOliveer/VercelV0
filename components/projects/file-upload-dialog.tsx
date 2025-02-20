"use client"

import { useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface FileUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload: (files: FileList) => void
}

export function FileUploadDialog({ open, onOpenChange, onUpload }: FileUploadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onUpload(files)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Anexar Arquivos</DialogTitle>
          <DialogDescription>Selecione os arquivos que deseja anexar ao projeto</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-8">
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />
          <Button
            variant="outline"
            className="w-full h-32 flex flex-col items-center justify-center gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-8 w-8" />
            <span>Clique para selecionar arquivos</span>
            <span className="text-xs text-muted-foreground">ou arraste e solte aqui</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

