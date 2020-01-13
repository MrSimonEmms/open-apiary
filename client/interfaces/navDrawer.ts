/**
 * navDrawer
 */

/* Node modules */

/* Third-party modules */

/* Files */

export interface IMenuItemAvatar {
  color?: string;
  text?: string;
  textColor?: string;
  img?: string;
  alt?: string;
}

export interface IMenuItem {
  menu?: IMenuItem[];
  avatar?: IMenuItemAvatar;
  click?: () => void;
  href?: string;
  hrefTarget?: string;
  icon?: string;
  title?: string;
  exact?: boolean;
  to?: any; // @todo find the NuxtLink type
}
