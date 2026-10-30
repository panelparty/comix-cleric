// -- Utilities for reordering items in an array. -- //

// Utilities
import { cloneDeep } from "lodash-es";

// Moves an item from one position to another and returns the new array.
export function moveItem(array, fromIndex, toIndex) {
  const newArray = cloneDeep(array);
  const [item] = newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, item);

  return { value: newArray, newIndex: toIndex };
}

// Moves the selected item one step toward the start of the list.
export function moveUp(array, selected, index) {
  const newIndex = index - 1;
  selected = newIndex;

  return moveItem(array, index, newIndex);
}

// Moves the selected item one step toward the end of the list.
export function moveDown(array, selected, index) {
  const newIndex = index + 1;
  selected = newIndex;

  return moveItem(array, index, newIndex);
}

// Moves the selected item to the very start of the list.
export function moveTop(array, selected, index) {
  const newIndex = 0;
  selected = newIndex;

  return moveItem(array, index, newIndex);
}

// Moves the selected item to the very end of the list.
export function moveBottom(array, selected, index) {
  const newIndex = array.length - 1;
  selected = newIndex;

  return moveItem(array, index, newIndex);
}
