# templateproject v2

Production-ready Angular 21 application with a scalable feature-based architecture.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Angular 21 (standalone components, signals) |
| Language | TypeScript 5.9 — strict mode |
| UI components | PrimeNG 21 with Aura theme |
| Layout utilities | PrimeFlex 4 |
| Styling | SCSS with CSS custom-property design tokens |
| HTTP | `provideHttpClient` with functional interceptors |
| State | Angular Signals (local & feature state) |
| Testing | Vitest |

---

## Commands

```bash
npm start          # Dev server → http://localhost:4200
npm run build      # Production build → dist/
npm test           # Unit tests (Vitest)
npm run watch      # Build in watch mode
```

Run a single test file:

```bash
npx vitest run src/app/app.spec.ts
```

---

## Project structure

```
src/
├── app/
│   ├── core/                        # Singleton services, guards, interceptors
│   │   ├── auth/
│   │   │   └── auth.service.ts      # Signals-based auth state + login/logout
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts  # Attaches Bearer token to every request
│   │   │   └── error.interceptor.ts # Handles 400 / 401 / 403 / 5xx globally
│   │   ├── guards/
│   │   │   └── auth.guard.ts        # CanActivateFn — redirects to /auth/login
│   │   └── core.providers.ts        # Barrel re-export for the core layer
│   │
│   ├── shared/                      # Reusable standalone components
│   │   ├── components/
│   │   │   └── button/              # Accessible polymorphic button (button | a)
│   │   └── shared.module.ts         # SHARED_IMPORTS array barrel
│   │
│   ├── features/                    # Lazy-loaded feature modules
│   │   ├── auth/
│   │   │   ├── ui/login.component   # Reactive login form (PrimeNG inputs)
│   │   │   └── auth.routes.ts
│   │   │   └── page.ts
│   │   └── dashboard/
│   │       ├── data-access/
│   │       │   ├── dashboard.service.ts  # Typed HTTP calls (+ dev mock)
│   │       │   └── dashboard.state.ts    # Signals state container
│   │       ├── ui/
│   │       │   └── dashboard.component   # KPI cards + activity table
│   │       └── dashboard.routes.ts
│   │
│   ├── layout/                      # Authenticated app shell
│   │   ├── header/                  # Sticky top bar + user menu
│   │   ├── sidebar/                 # Collapsible vertical nav
│   │   └── shell/                   # Shell wrapper (header + sidebar + outlet)
│   │
│   ├── app.config.ts                # Global providers (router, HTTP, PrimeNG)
│   ├── app.routes.ts                # Top-level routes with lazy loading
│   └── app.ts                       # Root component — <router-outlet> only
│
├── environments/
│   ├── environment.ts               # Dev: apiUrl, appName, version
│   └── environment.prod.ts          # Prod: swapped via angular.json fileReplacements
│
└── styles/
    ├── _tokens.scss                 # CSS custom properties + SCSS aliases
    ├── _mixins.scss                 # Responsive, flex, focus-ring, scrollbar mixins
    └── main.scss                    # Global base styles (reset, typography)
```

---

## Architecture decisions

### Standalone components only

All components use Angular's default standalone mode (Angular 20+). No NgModules except the `SHARED_IMPORTS` convenience barrel in `shared.module.ts`.

### Signals for state

Local and feature state is managed entirely with Angular Signals:

- `signal()` for mutable state
- `computed()` for derived values
- `asReadonly()` to expose signals publicly without allowing external mutation

`DashboardState` is a signals-based state container following the pattern:

```
idle → loading → success
                ↘ error
```

### HTTP interceptors (functional)

Both interceptors are registered via `withInterceptors([authInterceptor, errorInterceptor])` in `provideHttpClient`. No class-based interceptors.

### Routing

```
/                   → ShellComponent (authGuard)
  /dashboard        → DashboardComponent (lazy)
/auth/login         → LoginComponent (lazy, public)
/**                 → redirect to /dashboard
```

The guard reads `AuthService.isAuthenticated` (a computed signal) and redirects to `/auth/login` when false.

### Design tokens

All visual values (colors, spacing, typography, shadows, radii) are defined as CSS custom properties in `src/styles/_tokens.scss`. Component SCSS files reference only these tokens — no hardcoded values.

Dark mode is supported via the `.dark-mode` class on the `<html>` element, which overrides the surface and text tokens.

---

## Adding a new feature

1. Create `src/app/features/<name>/`
2. Add sub-folders: `data-access/` (service + state), `ui/` (components), `utils/` (pure functions)
3. Create `<name>.routes.ts` exporting a `Routes` array
4. Register lazy route in `app.routes.ts`:

```typescript
{
  path: '<name>',
  loadChildren: () =>
    import('./features/<name>/<name>.routes').then((m) => m.NAME_ROUTES),
}
```

5. Add a nav entry in `src/app/layout/sidebar/sidebar.component.ts`

---

## Environment configuration

| Variable | Dev | Prod |
|---|---|---|
| `production` | `false` | `true` |
| `apiUrl` | `http://localhost:3000/api` | `https://api.templateproject.app/api` |

In development, `DashboardService` and `AuthService` return mock data when `environment.production === false`, so the app works without a backend.
