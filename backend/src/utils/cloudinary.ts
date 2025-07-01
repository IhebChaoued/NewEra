/**
 * Extract Cloudinary public ID from secure URL.
 */
export function extractPublicId(url: string, folder: string): string {
  if (!url) return "";
  const regex = new RegExp(`${folder}/([^./]+)`);
  const match = url.match(regex);
  return match ? `${folder}/${match[1]}` : "";
}
