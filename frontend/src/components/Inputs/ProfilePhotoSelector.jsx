import React, { useRef, useState, useEffect } from "react"
import { LuUser, LuUpload, LuTrash } from "react-icons/lu"

const ProfilePhotoSelector = ({ file, setFile }) => {
  const inputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const handleImageChange = (e) => {
    const f = e.target.files?.[0] || null
    if (f) setFile(f)
  }

  const handleRemoveImage = () => {
    setFile(null)
  }

  const onChooseFile = () => inputRef.current?.click()

  return (
    <div className="mb-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      <div className="relative w-24 h-24">
        {/* Profile circle */}
        <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
          {previewUrl ? (
            <img src={previewUrl} alt="profile preview" className="w-full h-full object-cover" />
          ) : (
            <LuUser className="text-slate-400 w-10 h-10" />
          )}
        </div>

        {/* Button (Upload or Remove) positioned bottom-right */}
        {!previewUrl ? (
          <button
            type="button"
            onClick={onChooseFile}
            className="absolute bottom-0 right-1 bg-white p-2 rounded-full shadow-md border border-slate-300 hover:bg-slate-50 transition"
          >
            <LuUpload className="w-4 h-4 text-slate-700" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute bottom-1 right-1 bg-red-50 p-2 rounded-full shadow-md border border-red-300 hover:bg-red-100 transition"
          >
            <LuTrash className="w-4 h-4 text-red-700" />
          </button>
        )}
      </div>
    </div>
  )
}

export default ProfilePhotoSelector
