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
  events: PatientEvent[];
}

interface PatientEvent<T = any> {
  _id: string;
  type: 'entry' | 'studies' | 'biopsy' | 'oncological-committee' | 'pavilion' | 'follow-ups';
  data: T;
  datetime: Date;
}

interface Studies {
  images: File[];
  exams: File[];
}

interface Biopsy {
  detail: string;
  results: File[];
}

interface OncologicalCommittee {
  detail: string;
}

interface Pavilion {
  intervention: string;
  docs: File[];
  complications: string;
}

interface FollowUps {
  term: 'two-weeks'|'one-month'|'three-months'|'six-months'|'one-year';
  detail: string;
  files: [];
}