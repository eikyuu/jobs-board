/**
 * Shared layer barrel.
 *
 * Import `SHARED_IMPORTS` into any standalone component's `imports` array
 * to pull in all reusable shared components at once.
 *
 * @example
 * @Component({ imports: [...SHARED_IMPORTS] })
 */

import { ButtonComponent } from './components/button/button.component';

export { ButtonComponent };
export type { ButtonVariant, ButtonSize, ButtonType } from './components/button/button.component';

/** Convenience tuple of all shared standalone components/directives/pipes */
export const SHARED_IMPORTS = [ButtonComponent] as const;
