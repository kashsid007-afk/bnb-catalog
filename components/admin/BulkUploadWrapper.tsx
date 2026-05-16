'use client'
import { useRouter } from 'next/navigation'
import { BulkUpload } from './BulkUpload'

export function BulkUploadWrapper() {
  const router = useRouter()
  return (
    <BulkUpload onSuccess={() => { router.refresh() }} />
  )
}
