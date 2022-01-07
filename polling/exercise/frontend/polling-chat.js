const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");

let allChat = [];

const INTERVAL = 3000;

chat.addEventListener("submit", function (e) {
  e.preventDefault();
  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  chat.elements.text.value = "";
});

async function postNewMsg(user, text) {
  await fetch("http://localhost:3000/poll", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: { user: user, text: JSON.stringify(text) },
  });
}

async function getNewMsgs() {
  await fetch("http://localhost:3000/poll")
    .then((res) => res.json())
    .then((data) => (allChat = data.msg))
    .catch((e) => console.log(e));

  render();

  setTimeout(getNewMsgs, INTERVAL);
}

function render() {
  // as long as allChat is holding all current messages, this will render them
  // into the ui. yes, it's inefficent. yes, it's fine for this example
  const html = allChat.map(({ user, text, time, id }) =>
    template(user, text, time, id)
  );
  msgs.innerHTML = html.join("\n");
}

// given a user and a msg, it returns an HTML string to render to the UI
const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;

// make the first request
getNewMsgs();
