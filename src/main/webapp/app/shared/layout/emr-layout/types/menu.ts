// project import

// ==============================|| MENU TYPES  ||============================== //

import { NavItemType } from 'app/shared/layout/emr-layout/types/index';

export type MenuProps = {
  selectedItem: string[];
  selectedID: string | null;
  drawerOpen: boolean;
  error: null;
  menu: NavItemType;
};
