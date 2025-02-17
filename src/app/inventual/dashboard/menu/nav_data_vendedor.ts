import { INavbarData } from './helper';

export const navbarDataVendedor: INavbarData[] = [
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
        routeLink: '/historialcompra',
        icon: 'fal fa-file-invoice-dollar',
        label: 'Historial de compra',
    },
    {
        routeLink: '/vendedor',
        icon: 'fal fa-briefcase',
        label: 'Vendedor',
        items: [
            {
                routeLink: '/misproductos',
                icon: 'fal fa-box-open',
                label: 'Mis Productos',
            },
            {
                routeLink: '/misservicios',
                icon: 'fal fa-box-open',
                label: 'Mis Servicios',
            },
            {
                routeLink: '/transacciones',
                icon: 'fal fa-layer-group',
                label: 'Transacciones (No entrar)',
            },
        ]
    },
    {
      routeLink: '/perfil',
      icon: 'fal fa-user',
      label: 'Perfil (Usuario)',
    },
    {
      routeLink: '/perfilprovider',
      icon: 'fal fa-address-card',
      label: 'Perfil (Proveedor)',
    },
];
