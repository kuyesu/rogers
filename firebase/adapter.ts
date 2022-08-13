import type { Profile, Session, User } from 'next-auth';
import type { Adapter } from 'next-auth/adapters';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from '@firebase/firestore';
import {
  docSnapshotToObject,
  querySnapshotToObject,
  stripUndefined,
} from './utils';

export type FirebaseSession = Session & {
  id: string;
  expires: Date;
};

// @ts-expect-error
export const FirebaseAdapter: Adapter<
  Firestore,
  never,
  User & { id: string },
  Profile,
  FirebaseSession
> = (client: Firestore) => {
  return {
    displayName: 'FIREBASE',
    async createUser(user: any) {
      const collectionRef = collection(client, 'users');
      const docRef = doc(collectionRef);
      await setDoc(docRef, {
        id: docRef.id,
        ...user,
        image: user.image
          ? user.image
          : 'https://firebasestorage.googleapis.com/v0/b/ily-todo-ec6bb.appspot.com/o/Profile_avatar_placeholder_large.png?alt=media&token=d2a6af81-d0d5-45a5-89c5-ab57cf13bdf2',
      });
      const createdUser = await getDoc(docRef);
      return createdUser.data();
    },

    async getUser(id: any) {
      const user = await getDoc(doc(client, 'users', id));
      return docSnapshotToObject(user);
    },

    async getUserByEmail(email: any) {
      if (!email) return null;

      const q = query(collection(client, 'users'), where('email', '==', email));
      const user = await getDocs(q);
      return querySnapshotToObject(user);
    },

    async getUserByAccount({ provider, providerAccountId }: any) {
      const q = query(
        collection(client, 'accounts'),
        where('provider', '==', provider),
        where('providerAccountId', '==', providerAccountId),
        limit(1)
      );
      const account = await getDocs(q);
      if (account.empty) return null;
      const userId = account.docs[0].data().userId;

      const userSnapshot = await getDoc(doc(client, 'users', userId));

      return { ...userSnapshot.data(), id: userSnapshot.id } as any;
    },

    async updateUser(user: any) {
      await updateDoc(doc(client, 'users', user.id), stripUndefined(user));

      return user;
    },

    async deleteUser(userId: any) {
      await deleteDoc(doc(client, 'users', userId));
    },

    async linkAccount(account: any) {
      const accountRef = await addDoc(
        collection(client, 'accounts'),
        stripUndefined(account)
      );

      const accountSnap = await getDoc(accountRef);

      return docSnapshotToObject(accountSnap);
    },

    async unlinkAccount({ providerAccountId, provider }: any) {
      const q = query(
        collection(client, 'accounts'),
        where('provider', '==', provider),
        where('providerAccountId', '==', providerAccountId),
        limit(1)
      );
      const snapshot = await getDocs(q);

      const accountId = snapshot.docs[0].id;
      await deleteDoc(doc(client, 'accounts', accountId));
    },

    async createSession(data: any) {
      const sessionRef = await addDoc(collection(client, 'sessions'), data);
      const sessionSnap = await getDoc(sessionRef);
      return docSnapshotToObject(sessionSnap);
    },

    async getSessionAndUser(sessionToken: any) {
      const q = query(
        collection(client, 'sessions'),
        where('sessionToken', '==', sessionToken),
        limit(1)
      );
      const sessionSnapshot = await getDocs(q);
      const session = querySnapshotToObject(sessionSnapshot);

      if (!session) return null;

      if (session.expires < new Date()) {
        await deleteDoc(doc(client, 'sessions', session.id));
        return null;
      }

      const userSnap = await getDoc(doc(client, 'users', session.userId));
      const user = docSnapshotToObject(userSnap);

      if (!user) return null;

      return { session: session, user: user };
    },

    async updateSession(data: any) {
      const q = query(
        collection(client, 'sessions'),
        where('sessionToken', '==', data.sessionToken),
        limit(1)
      );
      const docSnap = await getDocs(q);
      const docRef = docSnap.docs[0].ref;

      await updateDoc(docRef, data);

      return data;
    },

    async deleteSession(sessionToken: any) {
      const q = query(
        collection(client, 'sessions'),
        where('sessionToken', '==', sessionToken),
        limit(1)
      );
      const snapshot = await getDocs(q);

      const session = querySnapshotToObject(snapshot);
      if (!session) return;

      await deleteDoc(doc(client, 'sessions', session.id));
    },

    async createVerificationToken(data: any) {
      const verificationRequestRef = await addDoc(
        collection(client, 'verificationTokens'),
        {
          ...data,
          expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
        }
      );

      const snapshot = await getDoc(verificationRequestRef);
      return docSnapshotToObject(snapshot);
    },
    async useVerificationToken({ identifier, token }: any) {
      const q = query(
        collection(client, 'verificationTokens'),
        where('token', '==', token),
        where('identifier', '==', identifier),
        limit(1)
      );

      const snapshot = await getDocs(q);

      const verificationToken = querySnapshotToObject(snapshot);

      if (!verificationToken) return null;

      await deleteDoc(
        doc(client, 'verificationRequests', verificationToken.id)
      );
      return verificationToken;
    },
  };
};
// };
// };
