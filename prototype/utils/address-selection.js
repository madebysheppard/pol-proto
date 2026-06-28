const selectedByMode = {
  delivery: "",
  return: "",
};

export function getSelectedAddress(mode) {
  return selectedByMode[mode] || "";
}

export function setSelectedAddress(mode, address) {
  selectedByMode[mode] = address;
}
