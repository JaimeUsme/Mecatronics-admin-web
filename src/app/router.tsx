import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/shared/components/layout'
import { DashboardPage } from '@/features/dashboard/pages'
import { ZonesPage } from '@/features/zones/pages'
import { PlansPage } from '@/features/plans/pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><DashboardPage /></Layout>,
  },
  {
    path: '/zonas',
    element: <Layout><ZonesPage /></Layout>,
  },
  {
    path: '/planes',
    element: <Layout><PlansPage /></Layout>,
  },
  {
    path: '/contacto',
    element: <Layout><div><h1 className="text-2xl font-bold mb-4">Contacto</h1></div></Layout>,
  },
  {
    path: '/usuarios',
    element: <Layout><div><h1 className="text-2xl font-bold mb-4">Usuarios</h1></div></Layout>,
  },
  {
    path: '/configuracion',
    element: <Layout><div><h1 className="text-2xl font-bold mb-4">Configuración</h1></div></Layout>,
  },
])
