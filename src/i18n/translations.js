export const translations = {
  ru: {
    h_1: "Каталог",
    h_2: "Корзина",
    h_3: "Бонус",
    h_4: "Балл",
    h_5: "Цена",
    h_6: "Итого:",
    h_7: "Доступный бонус",
    h_8: "В корзину",
    h_9: "Выбрать",
    h_10: "Обработка заказа",
    h_11: "Ветки",
    h_12: "Из какого магазина заберут:",
    h_13: "Доступно в корзине",
    h_14: "Подтверждение",
    h_15: "Назад",
    h_16: "Не удалось загрузить аккаунт. Пожалуйста, откройте каталог заново через кнопку «Каталог» в боте."
  },
  uz: {
    h_1: "Katalog",
    h_2: "Savatcha",
    h_3: "Bonus",
    h_4: "Ball",
    h_5: "Narxi",
    h_6: "Jami :",
    h_7: "Mavjud bonus",
    h_8: "Savatga",
    h_9: "Tanlash",
    h_10: "Buyurtmani rasmiylashtirish",
    h_11: "Filiallar",
    h_12: "Qaysi do'kondan olib ketiladi:",
    h_13: "Savatchada mavjud",
    h_14: "Tasdiqlash",
    h_15: "Orqaga",
    h_16: 'Akkaunt yuklanmadi. Iltimos, katalogni botdagi "Katalog" tugmasi orqali qayta oching.'
  }
};

export const getLang = () => localStorage.getItem("lang") || "ru";

export const t = (key) => {
  const lang = getLang();
  const dict = translations[lang] || translations.ru;
  return dict[key] || key;
};

export const formatPrice = (val) => {
  if (val === null || val === undefined || val === '') return '0';
  const parts = String(val).replace(/\s/g, '').split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
  return parts.join('.');
};

export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const getStore = () => {
  try {
    const store = localStorage.getItem("store");
    return store ? JSON.parse(store) : null;
  } catch {
    return null;
  }
};
