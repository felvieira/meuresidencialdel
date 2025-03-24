
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NewsItem {
  id: string;
  title: string;
  short_description: string;
  full_content: string;
  created_at: string;
  is_active: boolean;
}

export const useNews = () => {
  const [activeNewsItem, setActiveNewsItem] = useState<NewsItem | null>(null);
  const [allNewsItems, setAllNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch active news item
      const { data: activeData, error: activeError } = await supabase
        .from('news_items')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (activeError && activeError.code !== 'PGRST116') {
        throw activeError;
      }

      // Fetch all news items for history
      const { data: allData, error: allError } = await supabase
        .from('news_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (allError) {
        throw allError;
      }

      setActiveNewsItem(activeData || null);
      setAllNewsItems(allData || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const refetchNews = () => {
    fetchNews();
  };

  return {
    activeNewsItem,
    allNewsItems,
    isLoading,
    error,
    refetchNews
  };
};
