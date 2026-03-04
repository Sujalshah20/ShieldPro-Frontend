export const seedUsers = () => {
  if (!localStorage.getItem("users")) {
    localStorage.setItem(
      "users",
      JSON.stringify([
        {
          id: 1,
          role: "admin",
          email: "admin@shieldpro.com",
          password: "admin123",
          name: "Admin User"
        },
        {
          id: 2,
          role: "agent",
          email: "agent@shieldpro.com",
          password: "agent123",
          name: "John Agent"
        },
        {
          id: 3,
          role: "customer",
          email: "customer@shieldpro.com",
          password: "customer123",
          name: "Jane Customer"
        }
      ])
    );
  }
};
