document.getElementById("login-form").addEventListener("submit", async (event) => {
	event.preventDefault();

	const username = document.getElementById("user").value;
	const password = document.getElementById("password").value;
	const error = document.getElementById("error");

	error.hidden = true;
	error.textContent = "";

	try {
		const res = await fetch("/api/admin/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ username, password }),
			credentials: "include"
		});

		const data = await res.json();

		if(!res.ok) {
			error.textContent = data.error || "Login failed";
			error.hidden = false;
			return;
		}

		window.location.href = "/admin/";
	}
	catch {
		error.textContent = "Could not connect to the server";
		error.hidden = false;
	}
});
