'use client';

import { useState, useEffect, useCallback } from 'react';

import { useUIStore } from '@/store/ui.store';
import type { Notification } from '@/types/notifications';

/**
 * Mock notifications — replace with real API call Day 22.
 */
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Review Complete',
    body: 'AI review for codereview-ai/web#142 is ready. Score: 82/100.',
    type: 'REVIEW_COMPLETE',
    isRead: false,
    metadata: { reviewId: 'rev_1', score: 82 },
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: '2',
    title: 'PR Analyzed',
    body: 'Pull request "feat: add billing page" has been analyzed.',
    type: 'PR_ANALYZED',
    isRead: false,
    metadata: { prId: 'pr_2' },
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '3',
    title: 'Security Alert',
    body: '2 critical vulnerabilities found in api/auth module.',
    type: 'SYSTEM',
    isRead: false,
    metadata: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '4',
    title: 'Team Mention',
    body: '@sarah mentioned you in a review comment on PR #98.',
    type: 'MENTION',
    isRead: true,
    metadata: { prId: 'pr_98' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '5',
    title: 'Billing Update',
    body: 'Your Pro subscription renews in 3 days.',
    type: 'BILLING',
    isRead: true,
    metadata: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

/**
 * Hook for notification state management.
 *
 * TODO: Replace mock data with real API call (Day 22).
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isLoading, setIsLoading] = useState(false);
  const setUnreadCount = useUIStore((s) => s.setUnreadCount);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Sync unread count to Zustand store
  useEffect(() => {
    setUnreadCount(unreadCount);
  }, [unreadCount, setUnreadCount]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  return { notifications, unreadCount, markAsRead, markAllAsRead, isLoading };
}
