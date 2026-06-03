import path from "path";

export function getUploadRoot(): string {
  if (process.env.VERCEL === "1") {
    return "/tmp/uploads";
  }
  return path.join(process.cwd(), "public", "uploads");
}

export function getPublicUploadUrl(type: string, filename: string): string {
  if (process.env.VERCEL === "1") {
    return `/api/uploads/${type}/${filename}`;
  }
  return `/uploads/${type}/${filename}`;
}
