import type { AuthService } from '../types';

export default interface Auth {
   service: AuthService;
   username: string;
   id: string;
}
