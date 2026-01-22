export interface Employee {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface CreateEmployeeDto {
  name: string;
  email: string;
}

export interface UpdateEmployeeDto {
  name?: string;
  email?: string;
}
