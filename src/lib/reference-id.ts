import { nanoid } from "nanoid";

export function generateReferenceId(): string {
  const year = new Date().getFullYear();
  const id = nanoid(6).toUpperCase();
  return `FRMS-${year}-${id}`;
}
