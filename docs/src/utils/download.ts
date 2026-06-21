// Trigger a file download from an in-memory blob.
// @param content - The content to include in the blob
// @param fileName - The suggested download filename
// @param mimeType - MIME type of the blob
export function downloadBlob(content: BlobPart, fileName: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}
