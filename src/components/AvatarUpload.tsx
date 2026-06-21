"use client"

import { useRef, useState } from "react"
import NextImage from "next/image"
import { Upload, X } from "lucide-react"

type Props = {
  value: string | null
  onChange: (value: string | null) => void
}

function compressImage(file: File, maxSize: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")!
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL("image/jpeg", 0.7))
      }
      img.onerror = reject
      img.src = reader.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function AvatarUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Solo se admiten JPG y PNG")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("La imagen no debe pesar más de 2MB")
      return
    }

    setLoading(true)
    try {
      const dataUrl = await compressImage(file, 512)
      onChange(dataUrl)
    } catch {
      setError("Error al procesar la imagen")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm text-zinc-400">Avatar</label>
      <div className="flex items-center gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-full border border-zinc-700 bg-zinc-800">
          {value ? (
            <NextImage src={value} alt="avatar" width={80} height={80} className="size-full object-cover" unoptimized />
          ) : (
            <div className="flex size-full items-center justify-center text-2xl text-zinc-600">
              ?
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-purple-500 disabled:opacity-50"
          >
            <Upload className="size-4" />
            {loading ? "Comprimiendo..." : "Subir foto"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 transition-colors hover:text-white"
            >
              <X className="size-4" />
              Quitar
            </button>
          )}
          <p className="text-xs text-zinc-500">JPEG o PNG · máx 512×512px</p>
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}
