import { useCallback, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase-config";

const PAGE_SIZE = 20;
const postCollectionRef = collection(db, "post");

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchFirstPage = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(postCollectionRef, orderBy("createdAt", "desc"), limit(PAGE_SIZE));
      const snapshot = await getDocs(q);
      setPosts(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] ?? null);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch {
      setError("Could not load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!lastDoc) return;
    setError(null);
    try {
      const q = query(
        postCollectionRef,
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );
      const snapshot = await getDocs(q);
      setPosts((prev) => [
        ...prev,
        ...snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })),
      ]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] ?? lastDoc);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch {
      setError("Could not load more posts. Please try again.");
    }
  }, [lastDoc]);

  const addPost = useCallback(async ({ user, message, uid }) => {
    const optimisticId = `optimistic-${Math.random().toString(36).slice(2)}`;
    const optimisticPost = {
      id: optimisticId,
      user,
      message,
      uid,
      createdAt: new Date(),
      pending: true,
    };
    setPosts((prev) => [optimisticPost, ...prev]);
    setError(null);
    try {
      const docRef = await addDoc(postCollectionRef, {
        user,
        message,
        uid,
        createdAt: serverTimestamp(),
      });
      setPosts((prev) =>
        prev.map((post) =>
          post.id === optimisticId ? { ...post, id: docRef.id, pending: false } : post
        )
      );
    } catch {
      setPosts((prev) => prev.filter((post) => post.id !== optimisticId));
      setError("Could not post your message. Please try again.");
    }
  }, []);

  const removePost = useCallback(
    async (id) => {
      const previous = posts;
      setPosts((prev) => prev.filter((post) => post.id !== id));
      setError(null);
      try {
        await deleteDoc(doc(db, "post", id));
      } catch {
        setPosts(previous);
        setError("Could not delete the post. Please try again.");
      }
    },
    [posts]
  );

  useEffect(() => {
    fetchFirstPage();
  }, [fetchFirstPage]);

  return { posts, loading, error, hasMore, loadMore, addPost, removePost };
}
