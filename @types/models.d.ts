interface User {
  _id: string;
  rut: string;
  name: string;
  phone: string;
  email: string;
  enabled: boolean;
  offices: Office[];
  favoriteProducts: Product[];
  defaultOffice: string;
  role?: Role;
}