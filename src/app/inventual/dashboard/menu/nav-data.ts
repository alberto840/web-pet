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
    items: [
      {
        routeLink: '/productos',
        icon: 'fal fa-box-open',
        label: 'Ver Productos',
      },
      {
        routeLink: '/misproductos',
        icon: 'fal fa-box-open',
        label: 'Mis Productos',
      },
    ]
  },
  {
    routeLink: '/servicios',
    icon: 'fal fa-bell',
    label: 'Servicios',
    items: [
      {
        routeLink: '/servicios',
        icon: 'fal fa-box-open',
        label: 'Ver Servicios',
      },
      {
        routeLink: '/misservicios',
        icon: 'fal fa-box-open',
        label: 'Mis Servicios',
      },
    ]
  },
  {
    routeLink: '/categorias',
    icon: 'fal fa-layer-group',
    label: 'Categorias',
  },
  {
    routeLink: '/mascotas',
    icon: 'fal fa-paw',
    label: 'Mascotas',
  },
  {
    routeLink: '/historialcompra',
    icon: 'fal fa-file-invoice-dollar',
    label: 'Historial de compra',
  },
  {
    routeLink: '/profile',
    icon: 'fal fa-cog',
    label: 'Perfil',
  },
];
