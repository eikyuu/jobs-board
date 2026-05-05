export type InterviewType = 'phone' | 'hr' | 'technical' | 'onsite';

export interface InterviewJob {
  id: string;
  company: string;
  title: string;
}

export interface Interview {
  id: string;
  job: InterviewJob;
  notes: string | null;
  scheduledAt: string; // ISO-8601 local datetime
  type: InterviewType;
}
