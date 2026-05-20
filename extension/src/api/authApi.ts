import { storage } from '../utils/storage';

export async function logout(): Promise<void> {
  await storage.clear();
}