export const seedPolicies = () => {
  if (!localStorage.getItem("policies")) {
    localStorage.setItem(
      "policies",
      JSON.stringify([
        {
          id: 1,
          name: "Health Secure Plus",
          type: "Health",
          premium: 12000,
          status: "active"
        },
        {
          id: 2,
          name: "Life Shield Gold",
          type: "Life",
          premium: 18000,
          status: "active"
        },
        {
          id: 3,
          name: "Vehicle Protect",
          type: "Vehicle",
          premium: 8000,
          status: "inactive"
        }
      ])
    );
  }
};
