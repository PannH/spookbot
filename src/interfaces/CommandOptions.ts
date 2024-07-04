import type { StaffRole } from '@prisma/client';

export default interface CommandOptions {
   name: string;
   description: string;
   aliases?: string[];
   usage: {
      formats: string[];
      examples?: string[];
   };
   requireAuth?: boolean;
   roomOwnerOnly?: boolean;
   adminOnly?: boolean;
   requiredStaffRoles?: StaffRole[];
}
