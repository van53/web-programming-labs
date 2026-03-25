export {};

/** 4.1. Абстрактний клас-основа для всіх сповіщувачів */
abstract class BaseNotifier {
  constructor(protected readonly name: string) {}

  // Нащадки повинні реалізувати цей метод самостійно
  abstract send(to: string, subject: string, body: string): void;

  // Спільна логіка для всіх типів сповіщень
  notify(to: string, subject: string, body: string): void {
    console.log(`[${this.name}] Підготовка до відправки...`);
    this.send(to, subject, body);
    console.log(`[${this.name}] Статус: надіслано успішно.`);
  }
}

/** 4.2. Реалізація для Email */
class EmailNotifier extends BaseNotifier {
  constructor(private readonly smtpServer: string) {
    super("Email");
  }

  send(to: string, subject: string, body: string): void {
    const preview = body.length > 50 ? body.substring(0, 50) + "..." : body;
    console.log(`📧 Email → [${to}]: "${subject}" | Тіло: ${preview} (через ${this.smtpServer})`);
  }
}

/** 4.3. Реалізація для SMS */
class SmsNotifier extends BaseNotifier {
  constructor(private readonly phonePrefix: string = "+380") {
    super("SMS");
  }

  send(to: string, _subject: string, body: string): void {
    // В SMS заголовок зазвичай не використовується, беремо лише текст
    const preview = body.length > 160 ? body.substring(0, 160) + "..." : body;
    console.log(`📱 SMS → [${this.phonePrefix}${to}]: "${preview}"`);
  }
}

/** 4.4. Функція для масового розсилання (демонстрація поліморфізму) */
function sendBulkNotification(
  notifiers: BaseNotifier[],
  to: string,
  subject: string,
  body: string
): void {
  notifiers.forEach(notifier => {
    notifier.notify(to, subject, body);
    console.log("---");
  });
}

// --- Демонстрація ---
console.log("=== Завдання 4: Наслідування та поліморфізм ===");

const notifiers: BaseNotifier[] = [
  new EmailNotifier("smtp.gmail.com"),
  new SmsNotifier("44"), // Наприклад, префікс Британії
  new SmsNotifier()      // Дефолтний префікс +380
];

const messageSubject = "Нова задача призначена";
const messageBody = "Вам призначено задачу 'Розробити API' з пріоритетом high. Дедлайн: 01.02.2025. Будь ласка, ознайомтесь з документацією в системі Jira.";

sendBulkNotification(
  notifiers,
  "developer", // Для Email це буде частина адреси, для SMS — номер
  messageSubject,
  messageBody
);