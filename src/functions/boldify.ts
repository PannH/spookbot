// 𝘈 𝘉 𝘊 𝘋 𝘌 𝘍 𝘎 𝘏 𝘐 𝘑 𝘒 𝘓 𝘔 𝘕 𝘖 𝘗 𝘘 𝘙 𝘚 𝘛 𝘜 𝘝 𝘞 𝘟 𝘠 𝘡
const BOLD_LETTERS = {
   A: '𝘈',
   B: '𝘉',
   C: '𝘊',
   D: '𝘋',
   E: '𝘌',
   F: '𝘍',
   G: '𝘎',
   H: '𝘏',
   I: '𝘐',
   J: '𝘑',
   K: '𝘒',
   L: '𝘓',
   M: '𝘔',
   N: '𝘕',
   O: '𝘖',
   P: '𝘗',
   Q: '𝘘',
   R: '𝘙',
   S: '𝘚',
   T: '𝘛',
   U: '𝘜',
   V: '𝘝',
   W: '𝘞',
   X: '𝘟',
   Y: '𝘠',
   Z: '𝘡'
};

export function boldify(text: string): string {
   return text
      .split('')
      .map((letter) => BOLD_LETTERS[letter] ?? letter)
      .join('');
}
