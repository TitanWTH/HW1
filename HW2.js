"use strict"

(function () {
    const createAuthSystem = (maxAttempts = 3, lockTimeMs = 5000) => {
        const users = new Map();

        const registerUser = (login, password) => {
            if (users.has(login)) {
                return { success: false, message: `Користувач ${login} вже зареєстрований.` };
            }
            users.set(login, { password, failedAttempts: 0, lockedUntil: 0 });
            return { success: true, message: `Користувача ${login} створено.` };
        };

        const isLocked = (login) => {
            const user = users.get(login);
            if (!user) return false;
            return Date.now() < user.lockedUntil;
        };

        const login = (login, password) => {
            const user = users.get(login);
            if (!user) {
                return { success: false, message: "Користувача не знайдено." };
            }

            if (isLocked(login)) {
                return { success: false, message: "Обліковий запис тимчасово заблоковано. Спробуйте пізніше." };
            }

            if (user.password === password) {
                user.failedAttempts = 0;
                return { success: true, message: "Вхід успішний." };
            }

            user.failedAttempts += 1;
            if (user.failedAttempts >= maxAttempts) {
                user.lockedUntil = Date.now() + lockTimeMs;
                user.failedAttempts = 0;
                return { success: false, message: `Заблоковано після ${maxAttempts} невдалих спроб.` };
            }

            return { success: false, message: `Невірний пароль. Залишилось спроб: ${maxAttempts - user.failedAttempts}.` };
        };

        return { registerUser, login, isLocked };
    };

    
    const createEventBus = () => {
        const listeners = {};

        const subscribe = (eventName, handler) => {
            if (!listeners[eventName]) {
                listeners[eventName] = [];
            }
            listeners[eventName].push(handler);
            return () => unsubscribe(eventName, handler);
        };

        const unsubscribe = (eventName, handler) => {
            const handlers = listeners[eventName];
            if (!handlers) return;
            const index = handlers.indexOf(handler);
            if (index >= 0) {
                handlers.splice(index, 1);
            }
        };

        const notify = (eventName, payload) => {
            const handlers = listeners[eventName] || [];
            handlers.forEach((handler) => handler(payload));
        };

        return { subscribe, unsubscribe, notify };
    };

   
    const createTaskManager = () => {
        const tasks = [];
        let nextId = 1;

        const createTask = (title, description = "") => {
            if (!title) {
                return { success: false, message: "Назва завдання потрібна." };
            }
            const task = { id: nextId++, title, description, done: false, createdAt: new Date() };
            tasks.push(task);
            return { success: true, task };
        };

        const deleteTask = (id) => {
            const index = tasks.findIndex((task) => task.id === id);
            if (index < 0) {
                return { success: false, message: "Завдання не знайдено." };
            }
            tasks.splice(index, 1);
            return { success: true, message: "Завдання видалено." };
        };

        const toggleTaskStatus = (id) => {
            const task = tasks.find((item) => item.id === id);
            if (!task) {
                return { success: false, message: "Завдання не знайдено." };
            }
            task.done = !task.done;
            return { success: true, task };
        };

        const listTasks = () => tasks.map((task) => ({ ...task }));

        const searchTasks = (query) => {
            const normalized = String(query).trim().toLowerCase();
            return tasks
                .filter((task) => task.title.toLowerCase().includes(normalized))
                .map((task) => ({ ...task }));
        };

        return { createTask, deleteTask, toggleTaskStatus, listTasks, searchTasks };
    };

    const createPromoService = () => {
        const promos = new Map();

        const addPromo = (code, discount, uses) => {
            if (!code || uses <= 0) {
                return { success: false, message: "Код повинен бути непорожнім, а кількість використань більше нуля." };
            }
            promos.set(code.toUpperCase(), { discount, uses });
            return { success: true, message: `Промокод ${code} додано.` };
        };

        const applyPromo = (code) => {
            const normalized = String(code).toUpperCase();
            const promo = promos.get(normalized);
            if (!promo) {
                return { success: false, message: "Промокод не знайдено або недійсний." };
            }
            if (promo.uses <= 0) {
                return { success: false, message: "Промокод вичерпано." };
            }
            promo.uses -= 1;
            return { success: true, discount: promo.discount, remainingUses: promo.uses };
        };

        const getPromoInfo = (code) => {
            const promo = promos.get(String(code).toUpperCase());
            return promo ? { discount: promo.discount, uses: promo.uses } : null;
        };

        return { addPromo, applyPromo, getPromoInfo };
    };

    const auth = createAuthSystem(3, 6000);
    const events = createEventBus();
    const tasks = createTaskManager();
    const promo = createPromoService();

    console.log("--- AUTH DEMO ---");
    console.log(auth.registerUser("ivan", "1234"));
    console.log(auth.login("ivan", "0000"));
    console.log(auth.login("ivan", "1111"));
    console.log(auth.login("ivan", "2222"));
    console.log(auth.login("ivan", "1234"));

    console.log("--- EVENTS DEMO ---");
    const onNews = (payload) => console.log("Новина:", payload);
    const onAlert = (payload) => console.log("Алерт:", payload);
    events.subscribe("news", onNews);
    events.subscribe("news", onAlert);
    events.notify("news", { title: "Нове повідомлення", text: "Урок оновлено" });
    events.unsubscribe("news", onAlert);
    events.notify("news", { title: "Ще одне повідомлення" });

    console.log("--- TASKS DEMO ---");
    tasks.createTask("Порахувати бюджет", "Розрахувати витрати на місяць");
    tasks.createTask("Написати звіт", "Звіт за результатами тижня");
    tasks.toggleTaskStatus(1);
    console.log(tasks.listTasks());
    console.log(tasks.searchTasks("звіт"));
    tasks.deleteTask(2);
    console.log(tasks.listTasks());

    console.log("--- PROMO DEMO ---");
    promo.addPromo("SAVE10", 10, 2);
    console.log(promo.applyPromo("SAVE10"));
    console.log(promo.applyPromo("SAVE10"));
    console.log(promo.applyPromo("SAVE10"));
    console.log(promo.getPromoInfo("SAVE10"));
})();