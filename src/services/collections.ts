import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  Timestamp, 
  query, 
  where, 
  getDocs, 
  orderBy,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  limit,
  DocumentData
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Flashcard {
  front: string;
  back: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  visibility: 'public' | 'private';
  flashcards: Flashcard[];
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateCollectionData {
  name: string;
  description: string;
  visibility: 'public' | 'private';
  flashcards: Flashcard[];
}

export const createCollection = async (
  userId: string,
  data: CreateCollectionData
): Promise<string> => {
  if (!data.name?.trim()) {
    throw new Error('Collection name is required');
  }

  if (!data.flashcards?.length) {
    throw new Error('At least one flashcard is required');
  }

  data.flashcards.forEach((card, index) => {
    if (!card.front?.trim() || !card.back?.trim()) {
      throw new Error(`Both sides of flashcard ${index + 1} are required`);
    }
  });

  const timestamp = serverTimestamp();
  const collectionData = {
    ...data,
    userId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  try {
    const docRef = await addDoc(collection(db, 'collections'), collectionData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating collection:', error);
    throw new Error('Failed to create collection. Please try again.');
  }
};

export const updateCollection = async (
  collectionId: string,
  data: Partial<CreateCollectionData>
): Promise<void> => {
  if (data.name !== undefined && !data.name.trim()) {
    throw new Error('Collection name cannot be empty');
  }

  if (data.flashcards) {
    if (data.flashcards.length === 0) {
      throw new Error('At least one flashcard is required');
    }

    data.flashcards.forEach((card, index) => {
      if (!card.front?.trim() || !card.back?.trim()) {
        throw new Error(`Both sides of flashcard ${index + 1} are required`);
      }
    });
  }

  try {
    const docRef = doc(db, 'collections', collectionId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating collection:', error);
    throw new Error('Failed to update collection. Please try again.');
  }
};

export const deleteCollection = async (collectionId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'collections', collectionId));
  } catch (error) {
    console.error('Error deleting collection:', error);
    throw new Error('Failed to delete collection. Please try again.');
  }
};

export const subscribeToUserCollections = (
  userId: string,
  onUpdate: (collections: Collection[]) => void,
  onError: (error: Error) => void
) => {
  const q = query(
    collection(db, 'collections'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const collections = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Collection[];
      onUpdate(collections);
    },
    (error) => {
      console.error('Error subscribing to collections:', error);
      onError(error);
    }
  );
};

export const subscribeToPublicCollections = (
  onUpdate: (collections: Collection[]) => void,
  onError: (error: Error) => void
) => {
  const q = query(
    collection(db, 'collections'),
    where('visibility', '==', 'public'),
    orderBy('createdAt', 'desc'),
    limit(50)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const collections = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Collection[];
      onUpdate(collections);
    },
    (error) => {
      console.error('Error subscribing to public collections:', error);
      onError(error);
    }
  );
};

export const subscribeToCollection = (
  collectionId: string,
  onUpdate: (collection: Collection | null) => void,
  onError: (error: Error) => void
) => {
  const docRef = doc(db, 'collections', collectionId);

  return onSnapshot(
    docRef,
    (doc) => {
      if (doc.exists()) {
        onUpdate({
          id: doc.id,
          ...doc.data(),
        } as Collection);
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      console.error('Error subscribing to collection:', error);
      onError(error);
    }
  );
};