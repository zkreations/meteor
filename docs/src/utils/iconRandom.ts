// Check if the icon name is allowed for random icon selection
// @param iconName - The name of the icon to check
// @param ignoredIconNames - A set of icon names that should be ignored
// @param allowedIconNames - A set of icon names that are explicitly allowed (if not empty)
// @returns true if the icon name is allowed, false otherwise
export function isAllowedRandomIconName(
  iconName: string,
  ignoredIconNames: ReadonlySet<string>,
  allowedIconNames: ReadonlySet<string>,
): boolean {
  if (!iconName)
    return false
  if (allowedIconNames.size > 0 && !allowedIconNames.has(iconName))
    return false
  return !ignoredIconNames.has(iconName)
}
