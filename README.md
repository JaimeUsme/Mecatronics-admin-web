# Mecatronics Admin Web

Dashboard administrativo construido con React + TypeScript + Vite.

## 🏗️ Arquitectura

El proyecto sigue una arquitectura por features con capas claras:

```
src/
├── app/                    # Configuración de la aplicación
│   ├── App.tsx            # Componente raíz
│   ├── router.tsx         # Configuración de rutas
│   └── providers/         # Providers globales
│       ├── queryClient.ts # TanStack Query
│       ├── i18n.ts        # Internacionalización
│       └── index.tsx      # Provider wrapper
│
├── shared/                # Código compartido
│   ├── components/        # Componentes reutilizables
│   │   ├── ui/           # Componentes UI base (Shadcn UI)
│   │   ├── layout/       # Componentes de layout
│   │   ├── data-display/ # Componentes de visualización
│   │   └── feedback/     # Componentes de feedback
│   ├── hooks/            # Hooks personalizados
│   ├── utils/            # Utilidades
│   ├── constants/        # Constantes
│   └── types/            # Tipos compartidos
│
├── features/              # Features del negocio
│   ├── auth/             # Autenticación
│   ├── dashboard/        # Dashboard
│   ├── users/            # Gestión de usuarios
│   ├── roles/            # Gestión de roles
│   ├── reports/          # Reportes
│   └── settings/         # Configuración
│       ├── pages/        # Páginas
│       ├── components/   # Componentes específicos
│       ├── services/     # Servicios/API
│       ├── store/        # Estado (Zustand)
│       ├── validators/   # Validadores (Zod)
│       └── types/        # Tipos específicos
│
├── assets/               # Assets estáticos
└── styles/               # Estilos globales
```

## 🛠️ Stack Tecnológico

- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **TanStack Query** - Gestión de estado del servidor
- **Zustand** - Gestión de estado del cliente
- **React Router** - Enrutamiento
- **React Hook Form** - Formularios
- **Zod** - Validación de esquemas
- **Tailwind CSS** - Estilos
- **Shadcn UI** - Componentes UI

## 📦 Instalación

```bash
npm install
```

## 🚀 Desarrollo

```bash
npm run dev
```

## 🏭 Build

```bash
npm run build
```

## 📝 Convenciones

- **TypeScript estricto**: Sin `any`, tipado completo
- **Aliases**: Usar `@/` para imports absolutos
- **Features**: Cada feature es independiente y autocontenida
- **Componentes**: Funcionales con hooks
- **Estado**: TanStack Query para servidor, Zustand para cliente

## 📁 Estructura de Features

Cada feature contiene:

- `pages/` - Páginas/views
- `components/` - Componentes específicos del feature
- `services/` - Llamadas a API
- `store/` - Estado local con Zustand
- `validators/` - Esquemas de validación con Zod
- `types/` - Tipos TypeScript específicos

## 🎨 Estilos

- Tailwind CSS configurado con variables CSS para temas
- Shadcn UI preparado para componentes
- Soporte para modo oscuro

## ⚙️ Configuración

- **Aliases**: Configurados en `vite.config.ts` y `tsconfig.app.json`
- **Tailwind**: Configurado en `tailwind.config.js`
- **Shadcn UI**: Configurado en `components.json`
