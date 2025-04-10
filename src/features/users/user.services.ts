import { NotFoundError } from '#core/errors/custom.errors.js';
import { getUserById } from '#core/google.sheets/google.sheets.api.js';

export const getSheetOptions = async (userId: string): Promise<string[]> => {
  const user = await getUserById(userId);
  if (!user) throw new NotFoundError('User not found');

  const sheetOptions = user.sheets.split(',');
  return sheetOptions;
};
