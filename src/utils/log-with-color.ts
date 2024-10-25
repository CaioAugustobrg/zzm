// src/utils/logWithColor.ts
export function logWithColor(message: string, color: string, bold: boolean = false) {
    const colors: { [key: string]: string } = {
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        reset: '\x1b[0m'
    };

    const boldPrefix = bold ? '\x1b[1m' : '';
    console.log(`${boldPrefix}${colors[color]}${message}${colors.reset}`);
}
