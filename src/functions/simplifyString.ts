export default function simplifyString(string: string): string {
   return string
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z'-]/g, '');
}
