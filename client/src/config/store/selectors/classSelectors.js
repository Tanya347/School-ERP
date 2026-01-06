export const selectAvailableClasses = (state) => {
  const role = state.auth.user?.role;

  if (role === "admin") return state.admin.classes;
  if (role === "faculty") return state.faculty.classes;

  return [];
};