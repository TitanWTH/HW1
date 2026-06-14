// 1
function stringStats(str) {
  let letters = 0;
  let digits = 0;
  let others = 0;

  for (const char of str) {
    if (/\p{L}/u.test(char)) {
      letters += 1;
    } else if (/\p{Nd}/u.test(char)) {
      digits += 1;
    } else {
      others += 1;
    }
  }

  return { letters, digits, others };
}

// 2
function numberToText(number) {
  const n = Number(number);
  if (!Number.isInteger(n) || n < 10 || n > 99) {
    return 'Потрібне двозначне число';
  }

  const ones = ['', 'один', 'два', 'три', 'чотири', 'п’ять', 'шість', 'сім', 'вісім', 'дев’ять'];
  const teens = [
    'десять', 'одинадцять', 'дванадцять', 'тринадцять', 'чотирнадцять',
    'п’ятнадцять', 'шістнадцять', 'сімнадцять', 'вісімнадцять', 'дев’ятнадцять'
  ];
  const tens = ['', '', 'двадцять', 'тридцять', 'сорок', 'п’ятдесят', 'шістдесят', 'сімдесят', 'вісімдесят', 'дев’яносто'];

  const ten = Math.floor(n / 10);
  const one = n % 10;

  if (ten === 1) {
    return teens[one];
  }

  return one === 0 ? tens[ten] : `${tens[ten]} ${ones[one]}`;
}

// 3
function swapCaseAndDigits(str) {
  let result = '';

  for (const char of str) {
    if (/\d/.test(char)) {
      result += '_';
      continue;
    }

    if (/\p{L}/u.test(char)) {
      const lower = char.toLowerCase();
      const upper = char.toUpperCase();
      result += char === upper ? lower : upper;
      continue;
    }

    result += char;
  }

  return result;
}

// 4
function cssToCamelCase(propName) {
  return propName.replace(/-([\p{L}0-9])/gu, (_, char) => char.toUpperCase());
}

// 5
function phraseToAcronym(phrase) {
  const words = phrase.match(/\p{L}+/gu) || [];
  return words.map(word => word[0].toUpperCase()).join('');
}

// 6
function joinStrings(...parts) {
  return parts.map(String).join('');
}

// 7
function calculateExpression(expression) {
  const expr = String(expression).replace(/\s+/g, '');
  const match = expr.match(/^(-?\d+(?:\.\d+)?)([+\-*/])(-?\d+(?:\.\d+)?)$/);
  if (!match) {
    return 'Невірний вираз';
  }

  const a = Number(match[1]);
  const op = match[2];
  const b = Number(match[3]);

  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? 'Ділення на нуль' : a / b;
    default: return 'Невірний оператор';
  }
}

// 8
function urlInfo(url) {
  try {
    const parsed = new URL(url);
    return {
      protocol: parsed.protocol.replace(':', ''),
      domain: parsed.hostname,
      path: parsed.pathname === '/' ? '/' : parsed.pathname
    };
  } catch (error) {
    return 'Невірний URL';
  }
}

// 9
function splitString(str, delimiter) {
  if (delimiter === '') {
    return Array.from(str);
  }

  const result = [];
  let current = '';

  for (const char of String(str)) {
    if (char === delimiter) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

// 10
function print(template, ...params) {
  return String(template).replace(/%(\d+)/g, (_, index) => {
    const i = Number(index) - 1;
    return i >= 0 && i < params.length ? String(params[i]) : `%${index}`;
  });
}

// використання
console.log(stringStats('Hello 123! Привіт 45?')); // { letters: 11, digits: 5, others: 4 }
console.log(numberToText(35)); // тридцять п’ять
console.log(numberToText(89)); // вісімдесят дев’яносто
console.log(numberToText(12)); // дванадцять
console.log(swapCaseAndDigits('AbC123de')); // aBc___DE
console.log(cssToCamelCase('font-size')); // fontSize
console.log(cssToCamelCase('background-color')); // backgroundColor
console.log(phraseToAcronym('cascading style sheets')); // CSS
console.log(phraseToAcronym('об’єктноорієнтоване програмування')); // ООП
console.log(joinStrings('Hello', ' ', 'world', '!')); // Hello world!
console.log(calculateExpression('12 + 8')); // 20
console.log(calculateExpression('100/25')); // 4
console.log(urlInfo('https://itstep.org/ua/about')); // { protocol: 'https', domain: 'itstep.org', path: '/ua/about' }
console.log(splitString('10/08/2020', '/')); // ['10', '08', '2020']
console.log(print('Today is %1 %2.%3.%4', 'Monday', 10, 8, 2020)); // Today is Monday 10.8.2020
