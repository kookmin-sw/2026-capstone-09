import type { StorageData } from '../types';

export const storage = {
  get<K extends keyof StorageData>(keys: K[]): Promise<Pick<StorageData, K>> {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys as string[], (result) => {
        resolve(result as Pick<StorageData, K>);
      });
    });
  },

  set(data: Partial<StorageData>): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set(data, resolve);
    });
  },

  remove(keys: (keyof StorageData)[]): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.remove(keys as string[], resolve);
    });
  },

  clear(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.clear(resolve);
    });
  },
};