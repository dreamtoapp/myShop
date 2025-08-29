'use server';
import db from '@/lib/prisma';
import { auth } from '@/auth';

type Payload = {
  taxNumber?: string | null;
  commercialRegistrationNumber?: string | null;
  saudiBusinessId?: string | null;
};

export async function updateCompliance(payload: Payload) {
  const session = await auth();
  const role = session?.user?.role as string | undefined;
  if (!role || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
    return { ok: false as const, message: 'UNAUTHORIZED' };
  }
  const company = await db.company.findFirst({ select: { id: true } });
  if (!company) return { ok: false as const, message: 'NO_COMPANY' };
  const { taxNumber, commercialRegistrationNumber, saudiBusinessId } = payload;
  await db.company.update({
    where: { id: company.id },
    data: {
      ...(taxNumber !== undefined ? { taxNumber: (taxNumber ?? '') } : {}),
      ...(commercialRegistrationNumber !== undefined
        ? { commercialRegistrationNumber }
        : {}),
      ...(saudiBusinessId !== undefined ? { saudiBusinessId } : {}),
    },
  });
  return { ok: true as const };
}


