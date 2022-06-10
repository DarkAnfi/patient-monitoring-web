interface User {
  _id: string;
  rut: string;
  name: string;
  phone: string;
  email: string;
}

interface Patient {
  _id: string;
  name: string;
  age: number;
  history: any;
  prevision: string;
  derivedFrom: string;
  reason: string;
  observation: string;
  events: Dict[];
}