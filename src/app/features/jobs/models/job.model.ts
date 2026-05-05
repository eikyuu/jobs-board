export type JobStatus = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';

export type RemoteType = 'onsite' | 'hybrid' | 'full';

export type ContractType = 'CDI' | 'CDD' | 'Freelance' | 'Stage' | 'Alternance';

export type InterviewType = 'phone' | 'technical' | 'finalInterview' | 'hr';

export type ApplicationTypes = 'spontaneous' | 'standard';

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
  scheduledAt: string;
  type?: InterviewType;
  notes?: string;
}

export interface Job {
  id?: string;
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
  applicationType: ApplicationTypes;
}


export interface InterviewFormEntry {
  scheduledAt: Date | null;
  type: InterviewType | null;
}

export interface JobFormModel {
  title: string;
  company: string;
  location: string;
  remote: RemoteType | null;
  contractType: ContractType | null;
  status: JobStatus | null;
  appliedAt: Date | null;
  url: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  notes: string;
  interviews: InterviewFormEntry[];
}

export interface ValidJobFormModel extends JobFormModel {
  remote: RemoteType;
  contractType: ContractType;
  status: JobStatus;
}
