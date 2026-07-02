const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      throw new Error("Server returned HTML instead of JSON. Check API URL / backend route.");
    }

    if (res.ok) {
      alert("Registration Successful! Please check your email for the Welcome OTP.");
      login(data);
      navigate("/");
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (error) {
    console.error("Register Error:", error);
    alert(error.message || "Something went wrong.");
  }
};