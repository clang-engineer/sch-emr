// project import

// ==============================|| MENU TYPES  ||============================== //

import { NavItemType } from 'app/modules/emr-viewer/types/index';

export type MenuProps = {
  selectedItem: string[];
  selectedID: string | null;
  drawerOpen: boolean;
  error: null;
  menu: NavItemType;
};
