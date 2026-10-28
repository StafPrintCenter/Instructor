export interface ModuleFormValues {
  title: string;
  description: string;
  sort_order: number;
}

export const emptyModuleForm = (sortOrder = 0): ModuleFormValues => ({
  title: "",
  description: "",
  sort_order: sortOrder,
});