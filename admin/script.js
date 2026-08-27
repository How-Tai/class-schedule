async function login(username, password) {
  const body = new URLSearchParams({
    username,
    password
  });

  const res = await fetch("/admin/login.html", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: body.toString(),
    credentials: "include"
  });

  if (!res.ok) {
    console.log("Login failed");
    return;
  }

  console.log("Logged in");
}


document.querySelector("button").addEventListener("click", () => {

  const username = document.getElementById("user").value;

  const password = document.getElementById("password").value;

  login(username, password);

});
