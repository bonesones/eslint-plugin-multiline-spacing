# Changelog

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
