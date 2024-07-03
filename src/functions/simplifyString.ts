import removeAccents from './removeAccents';

export default function simplifyString(string: string): string {
   return removeAccents(string)
      .toLowerCase()
      .replace(/[^a-z'-]/g, '');
}
