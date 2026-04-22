import { JobStatus } from "../models/job.model";


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