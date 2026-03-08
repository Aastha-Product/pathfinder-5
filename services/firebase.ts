import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

// --- Configuration ---
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// --- Auth ---
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, pass: string) => {
  return createUserWithEmailAndPassword(auth, email, pass);
};

export const signInWithEmail = async (email: string, pass: string) => {
  return signInWithEmailAndPassword(auth, email, pass);
};

export const logout = () => firebaseSignOut(auth);

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// --- Firestore: Posts ---
export const subscribeToPosts = (callback: (posts: any[]) => void) => {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(posts);
  });
};

export const createPost = async (content: string, userId: string) => {
  await addDoc(collection(db, 'posts'), {
    content,
    authorId: userId,
    createdAt: serverTimestamp(),
    likes: 0,
    comments: 0
  });
};

export const likePost = async (postId: string, userId: string) => {
  const likeRef = doc(db, 'posts', postId, 'likes', userId);
  const likeSnap = await getDoc(likeRef);
  if (likeSnap.exists()) {
    await deleteDoc(likeRef);
  } else {
    await setDoc(likeRef, { userId, createdAt: serverTimestamp() });
  }
};

// --- Firestore: Projects ---
export const subscribeToProject = (projectId: string, callback: (project: any) => void) => {
  return onSnapshot(doc(db, 'projects', projectId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    } else {
      callback(null);
    }
  });
};

export const updateProjectBoard = async (projectId: string, tasks: any[]) => {
  // Assuming tasks are stored in a subcollection or array. 
  // For subcollection 'board':
  // This is a simplified example. Real implementation depends on data structure.
  const batch = writeBatch(db); // Use batch for multiple updates
  tasks.forEach(task => {
    const taskRef = doc(db, 'projects', projectId, 'board', task.id);
    batch.set(taskRef, task, { merge: true });
  });
  await batch.commit();
};

// --- Cloud Functions ---
export const inviteMemberToProject = async (email: string, projectId: string, role: string) => {
  const sendInvite = httpsCallable(functions, 'sendProjectInviteEmail');
  return sendInvite({ email, projectId, role });
};

export const acceptProjectInvite = async (inviteId: string) => {
  const acceptInvite = httpsCallable(functions, 'acceptProjectInvite');
  return acceptInvite({ inviteId });
};

export const inviteToInterview = async (interviewId: string, email: string) => {
  const sendInvite = httpsCallable(functions, 'sendInterviewInviteEmail');
  return sendInvite({ interviewId, toEmail: email });
};

// --- Mock Interviews ---
export const subscribeToInterview = (interviewId: string, callback: (interview: any) => void) => {
  return onSnapshot(doc(db, 'mockInterviews', interviewId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    }
  });
};

export const submitFeedback = async (interviewId: string, feedback: any) => {
  await addDoc(collection(db, 'mockInterviews', interviewId, 'feedback'), {
    ...feedback,
    createdAt: serverTimestamp()
  });
  // The Cloud Function 'analyzeInterviewFeedback' will trigger automatically
};

export const subscribeToPracticePlan = (interviewId: string, callback: (plan: any) => void) => {
  return onSnapshot(doc(db, 'mockInterviews', interviewId, 'aiPracticePlan', 'latest'), (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
};
