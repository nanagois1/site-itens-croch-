if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const form = document.getElementById("form");
const gallery = document.getElementById("gallery");

let items = JSON.parse(localStorage.getItem("items")) || [];

/* CARREGA AO ABRIR O SITE */
items.forEach(item => createCard(item));

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const imageInput = document.getElementById("image");
  const linha = document.getElementById("linha").value;
  const cor = document.getElementById("cor").value;
  const link = document.getElementById("link").value;

  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function () {
    const item = {
      id: Date.now(),
      image: reader.result,
      linha,
      cor,
      link
    };

    items.push(item);
    localStorage.setItem("items", JSON.stringify(items));

    createCard(item);
    form.reset();
  };

  reader.readAsDataURL(file);
});

/* FUNÇÃO PRA CRIAR O CARD */
function createCard(item) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.id = item.id;

  const img = document.createElement("img");
  img.src = item.image;

  const info = document.createElement("div");
  info.classList.add("info");

  info.innerHTML = `
    <p><strong>Linha:</strong> ${item.linha}</p>
    <p><strong>Cor:</strong> ${item.cor}</p>
    <p>
      <strong>Link:</strong>
      <a href="${item.link}" target="_blank">abrir 🔗</a>
    </p>
    <button>Remover 🗑️</button>
  `;

  info.querySelector("button").addEventListener("click", () => {
    removeItem(item.id);
    card.remove();
  });

  card.appendChild(img);
  card.appendChild(info);
  gallery.appendChild(card);
}

/* REMOVE DO LOCALSTORAGE */
function removeItem(id) {
  items = items.filter(item => item.id !== id);
  localStorage.setItem("items", JSON.stringify(items));
}

function logout() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}
