/**
 * IndexedDB utility for storing generated images
 * This module provides a simple API for persisting images locally in the browser
 */

import type { GeneratedImage } from './types';

const DB_NAME = 'SlopShopDB';
const DB_VERSION = 1;
const STORE_NAME = 'images';

/**
 * Initialize and open the IndexedDB database
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        // Create index on timestamp for sorting
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

/**
 * Save an image to IndexedDB
 */
export async function saveImage(image: GeneratedImage): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Convert Date to ISO string for storage
    const imageToStore = {
      ...image,
      timestamp: image.timestamp.toISOString(),
    };

    const request = store.put(imageToStore);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
  });
}

/**
 * Get all images from IndexedDB, sorted by timestamp (newest first)
 */
export async function getAllImages(): Promise<GeneratedImage[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('timestamp');

    // Get all records in descending order (newest first)
    const request = index.openCursor(null, 'prev');
    const images: GeneratedImage[] = [];

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

      if (cursor) {
        const image = cursor.value;
        // Convert ISO string back to Date
        images.push({
          ...image,
          timestamp: new Date(image.timestamp),
        });
        cursor.continue();
      } else {
        resolve(images);
      }
    };

    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
  });
}

/**
 * Delete an image from IndexedDB
 */
export async function deleteImage(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
  });
}

/**
 * Clear all images from IndexedDB
 */
export async function clearAllImages(): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
  });
}

/**
 * Get a single image by ID
 */
export async function getImage(id: string): Promise<GeneratedImage | undefined> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      const image = request.result;
      if (image) {
        resolve({
          ...image,
          timestamp: new Date(image.timestamp),
        });
      } else {
        resolve(undefined);
      }
    };

    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
  });
}
