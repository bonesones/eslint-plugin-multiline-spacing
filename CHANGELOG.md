# Changelog

## 1.2.0 (2025-09-29)

### Added

- New rule multiline-js-padding for enforcing blank lines in JS/TS code around:
  - BlockStatement
  - VariableDeclaration / top-level ObjectExpression
  - FunctionDeclaration, FunctionExpression, ArrowFunctionExpression
  - CallExpression (multiline)

### Changed

- Renamed `multiline-jsx-padding` rule to `multiline-padding`.
- Updated README.md.

## 1.1.1 (2025-09-13)

- Fixed: Corrected `main` entry in package.json so the plugin loads properly in ESLint.

## 1.1.0 - 2025-09-13

### Added

- Support for JSX expression containers inside JSX (e.g. `{condition && <Component />}`).
- Ignore rules inside `<svg>` elements.
- Better autofix behavior for inserting/removing blank lines.

### Fixed

- Autofix no longer removes or breaks inline JavaScript inside JSX.
- Improved handling of multiline vs. single-line sibling elements.

---

## 1.0.1 - 2025-09-13

### Added

- Added "LICENSE" file.

## 1.0.0 - 2025-09-13

- Initial release of the `eslint-plugin-multiline-spacing` plugin.
- Added `multiline-jsx-padding` rule for enforcing blank lines around custom and multiline JSX elements.
