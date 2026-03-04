export const getPolicies = () => {
  return JSON.parse(localStorage.getItem("policies")) || [];
};

export const savePolicies = (policies) => {
  localStorage.setItem("policies", JSON.stringify(policies));
};
