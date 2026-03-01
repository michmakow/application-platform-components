# application-platform-components
Shared component system used across multiple applications.

## Development
- Package manager: `pnpm`
- Build: `pnpm build`
- Dev watch: `pnpm dev`
- Storybook: `pnpm storybook`
- Add a changeset for every change: `pnpm changeset`

## Publishing
- On every merge to `master`, GitHub Actions builds and publishes using Changesets.
- Changelog entries are generated from git commit messages via `@changesets/changelog-git`.

## Notes
- The library assumes the host application provides CSS (e.g., Tailwind). Utility classes are not bundled.
- `LanguageSwitcher` requires configured `react-i18next` and `localStorage` support.
- `GlobalToast` and `GlobalLoadingOverlay` use `useUtilityStore` (Zustand).
- `ReportTimeDatePicker` renders a portal into `document.body`.
- Storybook is for development only and is not published to npm.
