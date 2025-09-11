import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function Login() {
  const nav = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: real auth later
    nav("/shop");
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        {/* cart icon */}
        <svg className="login-cart" viewBox="0 0 64 64" aria-hidden="true">
          <path d="M14 16h42l-5 22H22L17 12H6" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="26" cy="48" r="3" fill="white"/>
          <circle cx="44" cy="48" r="3" fill="white"/>
          <path d="M32 6v16m0-16l-5 6m5-6l5 6" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        <form onSubmit={onSubmit} className="login-form">
          <div className="input-wrap">
            <span className="input-icon">👤</span>
            <input
              type="text"
              placeholder="USERNAME"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </div>
          <div className="input-wrap">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              placeholder="PASSWORD"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">LOGIN</button>
          <button type="button" className="link-btn" onClick={() => alert("Reset flow TBD")}>
            Forgot password?
          </button>
        </form>
      </div>
    </div>
  );
}
