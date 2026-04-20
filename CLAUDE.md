# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at localhost:4200
npm run build      # Production build
npm test           # Run tests with Vitest
npm run watch      # Build in watch mode (development)
```

To run a single test file:
```bash
npx vitest run src/app/app.spec.ts
```

## Architecture

**Angular 21 standalone components** — no NgModules. All components use `standalone: true` and declare imports directly.

**Key entry points:**
- [src/main.ts](src/main.ts) — bootstraps the app with `appConfig`
- [src/app/app.config.ts](src/app/app.config.ts) — global providers (router, PrimeNG with Aura theme)
- [src/app/app.routes.ts](src/app/app.routes.ts) — route definitions

**UI:** PrimeNG 21 components with PrimeFlex utility classes for layout. The Aura theme preset is configured globally in `app.config.ts` via `providePrimeNG`.

**Styling:** SCSS throughout. Component-scoped styles in `.scss` files co-located with components.

**Testing:** Vitest (not Karma/Jasmine). Test files use `.spec.ts` suffix.

**TypeScript:** Strict mode enabled with strict Angular template checking (`strictTemplates: true`).

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
