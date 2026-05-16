// Cloudinary upload utility — used in admin BulkUpload component
// All images and videos go to Cloudinary, URLs stored in Supabase DB

export async function uploadToCloudinary(
  file: File,
  cloudName: string,
  uploadPreset: string
): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', 'bnb-catalog')

  const resourceType = file.type.startsWith('video/') ? 'video' : 'image'

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message ?? 'Cloudinary upload failed')
  }

  const data = await res.json()
  return data.secure_url as string
}
