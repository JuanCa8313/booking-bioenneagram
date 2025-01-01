// hooks/usePageTracking.ts
import { useEffect } from 'react';
import { segmentAnalytics } from '@/lib/segment-analytics';

export const usePageTracking = (pageName: string, pageData: Record<string, string>) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      segmentAnalytics.page('Book Page', {
        content_name: pageName,
        title: pageName,
        page_title: pageName,
        page_path: pageData.path,
        path: pageData.path,
        ...pageData
      });
    }
  }, [pageName, pageData]);
};