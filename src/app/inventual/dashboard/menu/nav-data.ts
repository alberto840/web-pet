import { INavbarData } from './helper';

export const navbarData: INavbarData[] = [
  {
    routeLink: '/home',
    icon: 'fal fa-home',
    label: 'Inicio',
  },
  {
    routeLink: '/productos',
    icon: 'fal fa-box-open',
    label: 'Productos',
  },
  {
    routeLink: '/servicios',
    icon: 'fal fa-bell',
    label: 'Servicios',
  },
  {
    routeLink: '/mascotas',
    icon: 'fal fa-paw',
    label: 'Mascotas',
  },
  {
    routeLink: '/user/agenda',
    icon: 'fal fa-calendar',
    label: 'Mis Reservas',
  },
  {
    routeLink: '/historialcompra',
    icon: 'fal fa-file-invoice-dollar',
    label: 'Historial de compra',
  },
];
