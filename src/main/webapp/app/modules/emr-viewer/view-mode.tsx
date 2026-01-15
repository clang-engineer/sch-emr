import * as React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export type ViewMode = 1 | 2 | 4;

export type ViewModeAction = {
  mode: ViewMode;
  label: string;
  icon: React.ReactNode;
};

export const VIEW_MODE_ACTIONS: ViewModeAction[] = [
  { mode: 1, label: '1장 보기', icon: <FontAwesomeIcon icon={['fas', 'book-open']} size="sm" /> },
  { mode: 2, label: '2장 보기', icon: <FontAwesomeIcon icon={['fas', 'columns']} size="sm" /> },
  { mode: 4, label: '4장 보기', icon: <FontAwesomeIcon icon={['fas', 'grid']} size="sm" /> },
];
