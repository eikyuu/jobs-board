import { Pipe, PipeTransform } from '@angular/core';

const OLD_APPLICATION_THRESHOLD_DAYS = 15;

@Pipe({
  name: 'isOldApplication',
})
export class IsOldApplicationPipe implements PipeTransform {
  
  transform(appliedAt: string): boolean {
    if (!appliedAt) return false;
    const appliedDate = new Date(appliedAt);
    if (isNaN(appliedDate.getTime())) return false;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - appliedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > OLD_APPLICATION_THRESHOLD_DAYS;
  }
}
