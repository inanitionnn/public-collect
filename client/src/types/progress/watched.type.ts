export const WatchedEnum = {
  reviewing: 'reviewing',
  viewing: 'viewing',
  completed: 'completed',
  abandoned: 'abandoned',
  paused: 'paused',
  planned: 'planned',
} as const;
export type WatchedType = (typeof WatchedEnum)[keyof typeof WatchedEnum];
