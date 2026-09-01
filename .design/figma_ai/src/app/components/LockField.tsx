import * as React from 'react';
import { Lock, LockOpen } from 'lucide-react';

// ── Detail page ─────────────────────────────────────────────────────────────

interface LockBadgeProps {
  show: boolean;
}

/** Inline lock icon with hover tooltip. Drop next to a field label on the detail page. */
export function LockBadge({ show }: LockBadgeProps) {
  if (!show) return null;
  return (
    <span className="relative group/lockbadge inline-flex items-center align-middle ml-1 cursor-default">
      <Lock className="w-3 h-3 text-amber-500" />
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-gray-900 text-white text-xs rounded-lg px-2.5 py-1.5 shadow-xl opacity-0 group-hover/lockbadge:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
        この項目は本人によってロックされています
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </span>
    </span>
  );
}

// ── Edit page ────────────────────────────────────────────────────────────────

interface LockToggleBtnProps {
  fieldKey: string;
  isOwnerPage: boolean;
  isLoggedIn: boolean;
  locked: boolean;
  onToggle: (key: string) => void;
}

/**
 * Lock toggle button shown next to a form field label on the edit page.
 *
 * Rules:
 * - Hidden entirely when not on the owner page.
 * - Not logged in + field unlocked → hidden (field editable, no clutter).
 * - Not logged in + field locked → lock icon shown but not clickable (field is disabled).
 * - Logged in → always shown; click toggles lock.
 */
export function LockToggleBtn({ fieldKey, isOwnerPage, isLoggedIn, locked, onToggle }: LockToggleBtnProps) {
  if (!isOwnerPage) return null;
  if (!isLoggedIn && !locked) return null;

  const clickable = isLoggedIn;
  const tooltipText = locked
    ? (isLoggedIn ? 'クリックでロック解除' : 'この項目は本人によってロックされています')
    : 'クリックでロック';

  return (
    <span className="relative group/lockbtn inline-flex items-center ml-auto pl-1 flex-shrink-0">
      <button
        type="button"
        onClick={() => clickable && onToggle(fieldKey)}
        className={`p-0.5 rounded transition-colors flex items-center ${
          locked
            ? `text-amber-500 ${clickable ? 'hover:text-amber-700 cursor-pointer' : 'cursor-default'}`
            : 'text-gray-300 hover:text-amber-400 cursor-pointer'
        }`}
        aria-label={locked ? 'ロック解除' : 'ロック'}
        tabIndex={clickable ? 0 : -1}
      >
        {locked ? <Lock className="w-3.5 h-3.5" /> : <LockOpen className="w-3.5 h-3.5" />}
      </button>
      <span className="absolute right-full top-1/2 -translate-y-1/2 mr-1.5 z-50 bg-gray-900 text-white text-xs rounded-lg px-2.5 py-1.5 shadow-xl opacity-0 group-hover/lockbtn:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
        {tooltipText}
        <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
      </span>
    </span>
  );
}

// ── Wrapper for disabled (locked) inputs on edit page ────────────────────────

interface LockedFieldWrapperProps {
  disabled: boolean;
  children: React.ReactNode;
}

/**
 * Wraps a form input. When `disabled` is true, shows an above-field tooltip
 * on hover explaining the field is locked. The actual input must also have
 * `disabled={disabled}` to prevent interaction.
 */
export function LockedFieldWrapper({ disabled, children }: LockedFieldWrapperProps) {
  if (!disabled) return <>{children}</>;
  return (
    <div className="relative group/lockedinput">
      {children}
      <div className="absolute bottom-full left-0 mb-1.5 z-50 bg-gray-900 text-white text-xs rounded-lg px-2.5 py-1.5 shadow-xl opacity-0 group-hover/lockedinput:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
        この項目は本人によってロックされています
        <div className="absolute top-full left-3 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}
