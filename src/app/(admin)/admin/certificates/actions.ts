"use server";

import { requireAdmin } from "@/lib/admin-auth";
import { certificateReorderSchema } from "@/lib/certificates";
import { prisma } from "@/lib/prisma";

export async function reorderCertificates(ids: string[]) {
  await requireAdmin();
  const validated = certificateReorderSchema.parse({ ids });
  await prisma.$transaction(
    validated.ids.map((id, displayOrder) =>
      prisma.certificate.update({ where: { id }, data: { displayOrder } }),
    ),
  );
  return { success: true };
}
