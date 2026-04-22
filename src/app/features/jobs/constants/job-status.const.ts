import { ContractType, JobStatus, RemoteType } from "../models/job.model";


export type TagSeverity = 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast';

export const STATUS_LABEL: Record<JobStatus, string> = {
  saved: 'Sauvegardé',
  applied: 'Candidaté',
  interview: 'Entretien',
  offer: 'Offre',
  rejected: 'Refus',
};

export const STATUS_SEVERITY: Record<JobStatus, TagSeverity> = {
  saved: 'secondary',
  applied: 'info',
  interview: 'warn',
  offer: 'success',
  rejected: 'danger',
};

export const REMOTE_OPTIONS: { label: string; value: RemoteType }[] = [
  { label: 'Présentiel', value: 'onsite' },
  { label: 'Hybride', value: 'hybrid' },
  { label: 'Full remote', value: 'full' },
];

export const CONTRACT_OPTIONS: { label: string; value: ContractType }[] = [
  { label: 'CDI', value: 'CDI' },
  { label: 'CDD', value: 'CDD' },
  { label: 'Freelance', value: 'Freelance' },
  { label: 'Stage', value: 'Stage' },
  { label: 'Alternance', value: 'Alternance' },
];

export const STATUS_OPTIONS: { label: string; value: JobStatus }[] = [
  { label: 'Sauvegardé', value: 'saved' },
  { label: 'Candidaté', value: 'applied' },
  { label: 'Entretien', value: 'interview' },
  { label: 'Offre', value: 'offer' },
  { label: 'Refus', value: 'rejected' },
];