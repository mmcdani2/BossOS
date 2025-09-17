import type { UUID } from "@bossos/types";

export function echo(id: UUID): string {
  return `Echo from core: ${id}`;
}
