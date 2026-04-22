export type JobStatus = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';

export type RemoteType = 'onsite' | 'hybrid' | 'full';

export type ContractType = 'CDI' | 'CDD' | 'Freelance' | 'Stage' | 'Alternance';

export type InterviewType = 'phone' | 'technical' | 'final' | 'hr';

export interface Salary {
  min: number;
  max: number;
  currency: string;
}

export interface Contact {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  linkedin?: string;
}

export interface Interview {
  date: string;
  type: InterviewType;
  notes?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: RemoteType;
  contractType: ContractType;
  salary?: Salary;
  status: JobStatus;
  appliedAt: string | null;
  updatedAt: string;
  url?: string;
  description?: string;
  tags: string[];
  notes?: string;
  contacts: Contact[];
  interviews: Interview[];
}
