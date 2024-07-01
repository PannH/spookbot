import type { StaffRole } from '@prisma/client';

export default interface CommandOptions {
   name: string;
   description: string;
   aliases?: string[];
   requireAuth?: boolean;
   roomOwnerOnly?: boolean;
   adminOnly?: boolean;
   requiredStaffRoles?: StaffRole[];
}
