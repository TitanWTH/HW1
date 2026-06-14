function createOrderItem(name, size, price) {
  return { name, size, price };
}

function normalizeString(value) {
  return String(value || '').trim().toLowerCase();
}

function askUser(question) {
  if (typeof prompt === 'function') {
    return prompt(question);
  }

  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

async function runOrderLoop() {
  const order = [];

  while (true) {
    const answer = normalizeString(await askUser('Додати щось до замовлення? (так/ні) '));
    if (answer === 'ні' || answer === 'no') {
      break;
    }

    if (answer !== 'так' && answer !== 'yes') {
      console.log('Будь ласка, введіть "так" або "ні".');
      continue;
    }

    let itemType = '';
    while (true) {
      itemType = normalizeString(await askUser('Виберіть позицію: Кола або Піца: '));
      if (itemType === 'кола' || itemType === 'коктейль' || itemType === 'cola' || itemType === 'cola') {
        itemType = 'Кола';
        break;
      }
      if (itemType === 'піца' || itemType === 'pizza') {
        itemType = 'Піца';
        break;
      }
      console.log('Будь ласка, введіть "Кола" або "Піца".');
    }

    let size = '';
    while (true) {
      size = normalizeString(await askUser('Введіть розмір (S або M): '));
      if (size === 's' || size === 'm') {
        size = size.toUpperCase();
        break;
      }
      console.log('Розмір має бути S або M.');
    }

    let price = 0;
    while (true) {
      const priceInput = normalizeString(await askUser('Введіть ціну: ')).replace(',', '.');
      price = Number(priceInput);
      if (!Number.isNaN(price) && price >= 0) {
        break;
      }
      console.log('Будь ласка, введіть коректну числову ціну.');
    }

    const item = createOrderItem(itemType, size, price);
    order.push(item);
    console.log(`Додано: ${itemType}, ${size}, ${price.toFixed(2)}`);
  }

  if (order.length === 0) {
    console.log('Замовлення порожнє.');
    return;
  }

  const summary = order.reduce(
    (acc, item) => {
      acc.total += item.price;
      if (item.name === 'Піца') {
        acc.pizzaTotal += item.price;
        acc.pizzaCount += 1;
      }
      if (item.name === 'Кола') {
        acc.colaTotal += item.price;
        acc.colaCount += 1;
      }
      acc.items[item.name] = (acc.items[item.name] || 0) + 1;
      return acc;
    },
    { total: 0, pizzaTotal: 0, colaTotal: 0, pizzaCount: 0, colaCount: 0, items: {} }
  );

  console.log('\nПідсумок замовлення:');
  for (const [name, count] of Object.entries(summary.items)) {
    console.log(`- ${name}: ${count} шт.`);
  }

  console.log(`Загальна сума: ${summary.total.toFixed(2)}`);
  console.log(`Сума за піци 🍕: ${summary.pizzaTotal.toFixed(2)}`);
  console.log(`Сума за колу 🥤: ${summary.colaTotal.toFixed(2)}`);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runOrderLoop, createOrderItem };
}

if (typeof prompt === 'function') {
  runOrderLoop();
} else if (typeof process !== 'undefined' && process.stdin) {
  runOrderLoop();
}
