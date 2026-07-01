export const saveHistory = (record) => {
  const history = JSON.parse(localStorage.getItem("diseaseHistory")) || [];
  history.push(record);
  localStorage.setItem("diseaseHistory", JSON.stringify(history));
};

export const getHistory = () => {
  return JSON.parse(localStorage.getItem("diseaseHistory")) || [];
};

export const clearHistory = () => {
  localStorage.removeItem("diseaseHistory");
};