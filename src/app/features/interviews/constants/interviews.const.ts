import { InterviewType } from '../models/interview.model';

export const TYPE_LABEL: Record<InterviewType, string> = {
  phone: 'Téléphone',
  hr: 'RH',
  technical: 'Technique',
  onsite: 'Sur site',
};

export const TYPE_SEVERITY: Record<InterviewType, 'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
  phone: 'info',
  hr: 'success',
  technical: 'warn',
  onsite: 'danger',
};