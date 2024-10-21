export function sanitizeId(id: string): string {
  if (id.length > 255) {
    throw new Error("ID too long");
  }
  return id.replace(/[^a-zA-Z0-9]/g, "");
}
