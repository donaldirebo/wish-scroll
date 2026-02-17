import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { contentService } from '../services/contentService';
import { ContentSwiper } from '../components/ContentSwiper';
import type { Post } from '../types/api';

export function Home() {
  const { logout, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Home mounted, user:', user);
    loadContent();
  }, []);

  const loadContent = async () => {
    console.log('Starting loadContent...');
    
    try {
      console.log('Calling contentService.getNew(20)...');
      const data = await contentService.getNew(20);
      console.log('Received data:', data);
      console.log('Number of posts:', data.length);
      setPosts(data);
    } catch (err: any) {
      console.error('ERROR loading content:', err);
      console.error('Error response:', err.response);
      setError(err.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  console.log('Render - loading:', loading, 'posts:', posts.length, 'error:', error);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading content...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
        <p className="text-xl mb-4">Error: {error}</p>
        <button onClick={loadContent} className="bg-blue-500 px-6 py-3 rounded-lg">Retry</button>
        <button onClick={logout} className="mt-4 bg-red-500 px-6 py-3 rounded-lg">Logout</button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
        <p className="text-xl mb-4">No posts found</p>
        <button onClick={loadContent} className="bg-blue-500 px-6 py-3 rounded-lg">Reload</button>
        <button onClick={logout} className="mt-4 bg-red-500 px-6 py-3 rounded-lg">Logout</button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={logout}
        className="absolute top-4 right-4 z-50 bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg"
      >
        Logout
      </button>
      <ContentSwiper posts={posts} onLoadMore={loadContent} />
    </>
  );
}
