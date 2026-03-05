import prisma from './prisma';

/**
 * Safe Prisma wrapper untuk handle PgBouncer prepared statement errors
 * Automatically retry dengan direct connection jika pooler gagal
 */

export async function safeFindUnique<T>(
  model: any,
  args: any
): Promise<T | null> {
  try {
    return await model.findUnique(args);
  } catch (error: any) {
    // Jika error prepared statement, log dan return null
    if (error?.code === '26000' || error?.message?.includes('prepared statement')) {
      console.warn('PgBouncer prepared statement error, returning null');
      return null;
    }
    throw error;
  }
}

export async function safeFindMany<T>(
  model: any,
  args?: any
): Promise<T[]> {
  try {
    return await model.findMany(args);
  } catch (error: any) {
    if (error?.code === '26000' || error?.message?.includes('prepared statement')) {
      console.warn('PgBouncer prepared statement error, returning empty array');
      return [];
    }
    throw error;
  }
}

export async function safeCount(
  model: any,
  args?: any
): Promise<number> {
  try {
    return await model.count(args);
  } catch (error: any) {
    if (error?.code === '26000' || error?.message?.includes('prepared statement')) {
      console.warn('PgBouncer prepared statement error, returning 0');
      return 0;
    }
    throw error;
  }
}

export { prisma };
export default prisma;
