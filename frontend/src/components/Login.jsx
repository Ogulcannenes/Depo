import { useState } from "react";

import api from "../api/api";

function Login({ setToken }) {
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const response = await api.post(
        "/auth/login",

        {
          username,
          password,
        },
      );

      const token = response.data.token;

      localStorage.setItem("token", token);

      setToken(token);
    } catch (error) {
      alert("Login başarısız");
    }
  };

  return (
    <div className="login-box">
      <h2>Giriş Yap</h2>

      <input
        type="text"
        placeholder="Kullanıcı adı"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>Giriş Yap</button>
    </div>
  );
}

export default Login;
