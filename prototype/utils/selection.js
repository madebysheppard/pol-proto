/**
 * Bind single-select behavior for a group of pressable elements.
 * Applies both visual state and aria-pressed consistency.
 */
export function bindSingleSelect(
  elements,
  { selectedClass = "choice-btn--selected", onChange } = {},
) {
  const items = Array.from(elements || []).filter(Boolean);

  const select = (selectedItem, { emit = true } = {}) => {
    items.forEach((item) => {
      const isSelected = item === selectedItem;
      item.classList.toggle(selectedClass, isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });

    if (emit && typeof onChange === "function") {
      onChange(selectedItem);
    }
  };

  items.forEach((item) => {
    item.addEventListener("click", () => {
      select(item);
    });
  });

  return {
    select,
    getSelected: () =>
      items.find((item) => item.classList.contains(selectedClass)) || null,
  };
}
