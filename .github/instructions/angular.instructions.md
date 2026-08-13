---
description: Core development rules for the Angular Countries Dashboard project
applyTo: "**/*.{ts,html,scss}"
---

# Project Development Rules

## Architecture

- Use modern Angular with Standalone Components.
- Follow the `core + features` architecture.
- Put application-wide services and models in `core`.
- Put user-facing functionality and feature-specific components in `features`.
- Keep the architecture simple. Do not introduce Repository, Facade, Store, or other abstraction layers unless there is a concrete need.
- Keep feature-specific logic close to the feature that owns it.

## Angular

- Prefer modern Angular APIs such as `inject()`, Signals, `computed()`, `input()`, and `output()`.
- Prefer the modern Angular control flow syntax (`@if`, `@for`, `@switch`).
- Use strict TypeScript typing and avoid `any`.
- Keep components focused on UI and user interaction.
- Keep API access inside services rather than components.

## API and MSW

- Angular code must access country data through `CountryService` and `HttpClient`.
- Never import `countries.json` directly from Angular application code.
- `countries.json` is mock backend data and should only be accessed by MSW handlers.
- Keep the application code independent from the mock implementation.

## State and RxJS

- Use Signals for local UI state and `computed()` for derived state.
- Use RxJS for HTTP requests and asynchronous/reactive streams.
- Use RxJS operators intentionally; avoid unnecessary complexity.
- Do not put UI-specific filtering, sorting, or pagination logic inside `CountryService`.
- Keep the data flow simple:

  `API → Service → Feature State → UI`

## UI and Styling

- Use semantic HTML and SCSS.
- Prefer HTML + SCSS instead of introducing a UI component library.
- Keep component-specific styles in component SCSS.
- Use CSS variables for theme-related values.
- Ensure all interactive elements have visible focus states and are keyboard accessible.
- Consider responsive behavior for mobile, tablet, and desktop.

## Error and Loading States

- Data-driven features should handle loading, success, empty, and error states.
- Country detail should also handle not-found states.
- Do not silently swallow API errors.

## Code Quality

- Prefer simple, readable solutions over clever abstractions.
- Do not introduce dependencies unless they provide clear value.
- Avoid unnecessary refactoring or changes unrelated to the requested task.
- Reuse existing services, models, and components when appropriate.
- Keep changes focused on the requested feature.
