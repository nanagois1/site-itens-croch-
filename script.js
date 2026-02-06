const form = document.getElementById("form");
const gallery = document.getElementById("gallery");

let userId = null;

/* QUANDO O USUÁRIO LOGAR */
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  userId = user.uid;

  // aplica tema do usuário
  db.collection("users")
    .doc(userId)
    .get()
    .then(doc => {
      if (doc.exists && doc.data().theme) {
        document.documentElement.style
          .setProperty("--primary", doc.data().theme);
      }
    });

  carregarItens();
});

/* CARREGA ITENS DO FIRESTORE */
function carregarItens() {
  gallery.innerHTML = "";

  db.collection("users")
    .doc(userId)
    .collection("items")
    .orderBy("createdAt")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        createCard({ id: doc.id, ...doc.data() });
      });
    });
}

/* ADICIONA ITEM */
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
    db.collection("users")
      .doc(userId)
      .collection("items")
      .add({
        image: reader.result,
        linha,
        cor,
        link,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        form.reset();
        carregarItens();
      });
  };

  reader.readAsDataURL(file);
});

/* CRIA CARD */
function createCard(item) {
  const card = document.createElement("div");
  card.classList.add("card");

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
    removerItem(item.id);
    card.remove();
  });

  card.appendChild(img);
  card.appendChild(info);
  gallery.appendChild(card);
}

/* REMOVE ITEM */
function removerItem(id) {
  db.collection("users")
    .doc(userId)
    .collection("items")
    .doc(id)
    .delete();
}

/* LOGOUT */
function logout() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}
