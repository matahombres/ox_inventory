import { ItemData } from '../typings/item';

export const Items: {
  [key: string]: ItemData | undefined;
} = {
  water: {
    name: 'water',
    close: false,
    label: 'VODA',
    stack: true,
    usable: true,
    count: 0,
  },
  burger: {
    name: 'burger',
    close: false,
    label: 'BURGR',
    stack: true,
    usable: true,
    count: 0,
  },
  copper: {
    name: 'copper',
    close: false,
    label: 'COPER',
    stack: true,
    usable: false,
    count: 0,
  },
  iron: {
    name: 'iron',
    close: false,
    label: 'IRON',
    stack: true,
    usable: false,
    count: 0,
  },
  powersaw: {
    name: 'powersaw',
    close: false,
    label: 'POWERSAW  ',
    stack: false,
    usable: false,
    count: 0,
  },
  backwoods: {
    name: 'backwoods',
    close: false,
    label: 'RUSIAN CREME',
    stack: false,
    usable: false,
    count: 0,
  },
};
