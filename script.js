const businessWhatsAppNumber = "15551234567";
const orderForm = document.querySelector("#orderForm");
const orderTextarea = document.querySelector('textarea[name="order"]');
const cartList = document.querySelector("#cartList");
const cartEmpty = document.querySelector("#cartEmpty");
const cartTotalEl = document.querySelector("#cartTotal");
const cartSend = document.querySelector(".cart-send");
const cartClear = document.querySelector(".cart-clear");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const cartItems = new Map();
const cartPrices = new Map();
const languagePages = {
  es: "index.html",
  en: "en.html",
  pt: "pt.html",
};
const currentLanguage = document.documentElement.lang || "es";

function normalizeLanguage(language) {
  const shortLanguage = String(language || "").toLowerCase().slice(0, 2);
  return languagePages[shortLanguage] ? shortLanguage : "es";
}

function currentPageName() {
  const page = window.location.pathname.split("/").pop();
  return page || "index.html";
}

function redirectToBrowserLanguage() {
  const selectedLanguage = localStorage.getItem("preferredLanguage");

  if (languagePages[selectedLanguage]) {
    const preferredPage = languagePages[selectedLanguage];

    if (currentPageName() !== preferredPage) {
      window.location.replace(preferredPage);
    }

    return;
  }

  const browserLanguage = normalizeLanguage(navigator.language || navigator.userLanguage);
  const targetPage = languagePages[browserLanguage];

  if (currentPageName() === "index.html" && browserLanguage !== "es") {
    window.location.replace(targetPage);
  }
}

document.querySelectorAll("[data-lang]").forEach((link) => {
  link.addEventListener("click", () => {
    localStorage.setItem("preferredLanguage", link.dataset.lang);
  });
});

document.querySelectorAll(".quick-add").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.dataset.item;
    const price = parseFloat(button.dataset.price) || 0;
    addToCart(item, price);
  });
});

document.querySelectorAll(".direct-whatsapp").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("#pedido").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    });
  });
}

cartSend.addEventListener("click", () => {
  const order = buildCartOrder();

  if (!order) {
    document.querySelector("#menu").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  openWhatsApp(order);
});

cartClear.addEventListener("click", () => {
  cartItems.clear();
  cartPrices.clear();
  renderCart();
});

function addToCart(item, price) {
  const quantity = cartItems.get(item) || 0;
  cartItems.set(item, quantity + 1);
  if (price) cartPrices.set(item, price);
  renderCart();
  document.querySelector("#pedido").scrollIntoView({ behavior: "smooth", block: "start" });
}

function removeFromCart(item) {
  const quantity = cartItems.get(item) || 0;

  if (quantity <= 1) {
    cartItems.delete(item);
    cartPrices.delete(item);
  } else {
    cartItems.set(item, quantity - 1);
  }

  renderCart();
}

function renderCart() {
  cartList.innerHTML = "";
  let total = 0;

  cartItems.forEach((quantity, item) => {
    const listItem = document.createElement("li");
    const itemText = document.createElement("span");
    const removeButton = document.createElement("button");

    itemText.textContent = `${quantity} x ${item}`;
    removeButton.type = "button";
    removeButton.textContent = getCopy().remove;
    removeButton.addEventListener("click", () => removeFromCart(item));
    listItem.append(itemText, removeButton);
    cartList.appendChild(listItem);

    const price = cartPrices.get(item) || 0;
    total += quantity * price;
  });

  const hasItems = cartItems.size > 0;
  cartEmpty.hidden = hasItems;
  cartSend.disabled = !hasItems;
  orderTextarea.value = buildCartOrder();

  if (cartTotalEl) {
    cartTotalEl.hidden = !hasItems;
    cartTotalEl.textContent = `Total: ${total.toFixed(2)}€`;
  }
}

function buildCartOrder() {
  return [...cartItems.entries()].map(([item, quantity]) => `${quantity} x ${item}`).join("\n");
}

function getCopy() {
  const copy = {
    es: {
      greeting: "Hola! Quiero hacer un pedido:",
      order: "Pedido",
      name: "Nombre",
      area: "Entrega/recogida",
      remove: "Quitar",
    },
    en: {
      greeting: "Hi! I would like to place an order:",
      order: "Order",
      name: "Name",
      area: "Delivery/pickup",
      remove: "Remove",
    },
    pt: {
      greeting: "Ola! Quero fazer um pedido:",
      order: "Pedido",
      name: "Nome",
      area: "Entrega/retirada",
      remove: "Remover",
    },
  };

  return copy[normalizeLanguage(currentLanguage)];
}

function openWhatsApp(order) {
  const text = getCopy();
  const formData = new FormData(orderForm);
  const name = String(formData.get("name") || "").trim();
  const area = String(formData.get("area") || "").trim();
  const messageLines = [text.greeting, "", `${text.order}:`, order];

  if (name) {
    messageLines.push(`${text.name}: ${name}`);
  }

  if (area) {
    messageLines.push(`${text.area}: ${area}`);
  }

  const message = messageLines.join("\n");
  const url = `https://wa.me/${businessWhatsAppNumber}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(orderForm);
  const name = String(data.get("name") || "").trim();
  const order = String(data.get("order") || "").trim();
  const area = String(data.get("area") || "").trim();
  const text = getCopy();
  const messageLines = [text.greeting, "", `${text.order}:`, order];

  if (name) {
    messageLines.push(`${text.name}: ${name}`);
  }

  if (area) {
    messageLines.push(`${text.area}: ${area}`);
  }

  const message = messageLines.join("\n");

  const url = `https://wa.me/${businessWhatsAppNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

renderCart();
redirectToBrowserLanguage();
