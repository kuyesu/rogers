import {
  DocumentSnapshot,
  FieldValue,
  QuerySnapshot,
} from '@firebase/firestore';

export function docSnapshotToObject(snapshot: DocumentSnapshot) {
  if (!snapshot.exists) {
    return null;
  }

  const data: any = snapshot.data();
  if (data.expires) {
    data.expires = data.expires.toDate();
  }

  if (data.timestamp) data.timestamp = data.timestamp.seconds * 1000;
  return { id: snapshot.id, ...data };
}

export function querySnapshotToObject(snapshot: QuerySnapshot) {
  if (snapshot.empty) {
    return null;
  }
  const doc = snapshot.docs[0];

  const data: any = doc.data();
  if (data.expires) {
    data.expires = data.expires.toDate();
  }
  if (data.timestamp) data.timestamp = data.timestamp.seconds * 1000;

  return { id: doc.id, ...data };
}

export function querySnapshotsToObject(snapshot: any) {
  if (snapshot.empty) {
    return null;
  }

  const editedSnapshot = snapshot.docs.map((snap: any) => {
    const task = snap.data();

    return {
      ...task,
      id: snap.id,
      timestamp: task.timestamp ? task.timestamp.seconds * 1000 : null,
    };
  });

  return editedSnapshot;
}

export function stripUndefined(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => typeof value !== 'undefined')
  ) as FieldValue | Partial<unknown>;
}
