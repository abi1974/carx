import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// CarXApp.jsx
import React, { useEffect, useMemo, useState } from "react";

/*
  CarX single-file site:
  - Sections stacked top to bottom: Home, Cars, Booking, About, Customer Service, Auth
  - MOCK mode by default (mock data stored in localStorage). To use real backend,
    set BACKEND_BASE_URL to your API server and set USE_MOCK=false.
*/

const BACKEND_BASE_URL = ""; // e.g. "http://localhost:5000"
const USE_MOCK = !BACKEND_BASE_URL;

const heroBg = "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2000&auto=format&fit=crop";
const sectionBg = "https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=2000&auto=format&fit=crop";
const aboutBg = "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2000&auto=format&fit=crop";
const supportBg = "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2000&auto=format&fit=crop";

// ---------- Mock cars sample ----------
const SAMPLE_CARS = [
  {
    id: "c1",
    brand: "Toyota",
    model: "Corolla",
    year: 2022,
    price: 1600000,
    fuel: "Petrol",
    seats: 5,
    transmission: "Automatic",
    mileage: "18 kmpl",
    img: "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "c2",
    brand: "Hyundai",
    model: "Creta",
    year: 2023,
    price: 1350000,
    fuel: "Diesel",
    seats: 5,
    transmission: "Automatic",
    mileage: "16 kmpl",
    img: "https://images.unsplash.com/photo-1613371645224-f21a8952a0b6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "c3",
    brand: "BMW",
    model: "3 Series",
    year: 2021,
    price: 4200000,
    fuel: "Petrol",
    seats: 5,
    transmission: "Automatic",
    mileage: "12 kmpl",
    img: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "c4",
    brand: "Tata",
    model: "Nexon",
    year: 2022,
    price: 900000,
    fuel: "Electric",
    seats: 5,
    transmission: "Automatic",
    mileage: "250 km/charge",
    img: "https://images.unsplash.com/photo-1608889177443-74d2b67b5f22?q=80&w=1200&auto=format&fit=crop",
  },
];

// -------------- Helpers ----------------
const inr = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

// -------------- Minimal mock API --------------
const API = {
  async listCars() {
    if (USE_MOCK) {
      if (!localStorage.getItem("carx_cars")) {
        localStorage.setItem("carx_cars", JSON.stringify(SAMPLE_CARS));
      }
      return JSON.parse(localStorage.getItem("carx_cars"));
    } else {
      const res = await fetch(`${BACKEND_BASE_URL}/api/cars`);
      if (!res.ok) throw new Error("Failed to fetch cars");
      return res.json();
    }
  },
  async signup(payload) {
    if (USE_MOCK) {
      const users = JSON.parse(localStorage.getItem("carx_users") || "[]");
      if (users.find((u) => u.email === payload.email)) throw new Error("User exists");
      const user = { id: Date.now().toString(), ...payload };
      users.push(user);
      localStorage.setItem("carx_users", JSON.stringify(users));
      return { message: "ok" };
    } else {
      const r = await fetch(`${BACKEND_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    }
  },
  async login(payload) {
    if (USE_MOCK) {
      const users = JSON.parse(localStorage.getItem("carx_users") || "[]");
      const found = users.find((u) => u.email === payload.email && u.password === payload.password);
      if (!found) throw new Error("Invalid credentials");
      localStorage.setItem("carx_auth", JSON.stringify({ email: found.email, token: "mock-token" }));
      return { token: "mock-token", user: { email: found.email, name: found.name } };
    } else {
      const r = await fetch(`${BACKEND_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    }
  },
  async bookViewing(payload) {
    if (USE_MOCK) {
      const bookings = JSON.parse(localStorage.getItem("carx_bookings") || "[]");
      bookings.push({ id: Date.now().toString(), ...payload });
      localStorage.setItem("carx_bookings", JSON.stringify(bookings));
      return { status: "ok" };
    } else {
      const r = await fetch(`${BACKEND_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    }
  },
  async submitReview(payload) {
    if (USE_MOCK) {
      const reviews = JSON.parse(localStorage.getItem("carx_reviews") || "[]");
      reviews.push({ id: Date.now().toString(), ...payload });
      localStorage.setItem("carx_reviews", JSON.stringify(reviews));
      return { status: "ok" };
    } else {
      const r = await fetch(`${BACKEND_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    }
  },
};

// -------------- UI Components --------------
function Section({ id, bg, title, subtitle, children }) {
  return (
    <section id={id} className="w-full">
      <div style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div style={{ background: "rgba(0,0,0,0.45)" }} className="p-12 text-white">
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            {title && <h2 style={{ fontSize: 32, marginBottom: 8 }}>{title}</h2>}
            {subtitle && <p style={{ marginBottom: 12 }}>{subtitle}</p>}
            <div>{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 14, boxShadow: "0 6px 18px rgba(0,0,0,0.08)", color: "#111", ...style }}>
      {children}
    </div>
  );
}

// -------------- Main App --------------
export default function CarXApp() {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({ brand: "All", year: "All", minPrice: 0, maxPrice: 99999999, transmission: "All" });
  const [selectedCar, setSelectedCar] = useState(null);
  const [bookingForm, setBookingForm] = useState({ carId: "", name: "", phone: "", date: "" });
  const [auth, setAuth] = useState(() => JSON.parse(localStorage.getItem("carx_auth") || "null"));
  const [authMode, setAuthMode] = useState("login");
  const [rating, setRating] = useState(8);
  const [reviewText, setReviewText] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.listCars().then(setCars).catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    if (!bookingForm.carId && cars.length) setBookingForm((b) => ({ ...b, carId: cars[0].id }));
  }, [cars]);

  const brands = useMemo(() => ["All", ...Array.from(new Set(cars.map((c) => c.brand)))], [cars]);
  const years = useMemo(() => ["All", ...Array.from(new Set(cars.map((c) => c.year)))], [cars]);

  const filtered = cars.filter((c) => {
    if (filters.brand !== "All" && c.brand !== filters.brand) return false;
    if (filters.year !== "All" && String(c.year) !== String(filters.year)) return false;
    if (filters.transmission !== "All" && c.transmission !== filters.transmission) return false;
    if (c.price < filters.minPrice || c.price > filters.maxPrice) return false;
    return true;
  });

  async function handleSignup(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await API.signup({ name: form.get("name"), email: form.get("email"), password: form.get("password") });
      setMessage("Signup successful — please log in.");
      setAuthMode("login");
    } catch (err) {
      setMessage(String(err.message || err));
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      const res = await API.login({ email: form.get("email"), password: form.get("password") });
      setAuth(res.user ? res.user : { email: form.get("email") });
      localStorage.setItem("carx_auth", JSON.stringify(res.user ? res.user : { email: form.get("email") }));
      setMessage("Logged in!");
    } catch (err) {
      setMessage(String(err.message || err));
    }
  }

  async function handleBook(e) {
    e.preventDefault();
    try {
      await API.bookViewing({ ...bookingForm, user: auth?.email || "guest" });
      setMessage("Viewing booked! We will contact you soon.");
      setBookingForm({ carId: bookingForm.carId, name: "", phone: "", date: "" });
    } catch (err) {
      setMessage(String(err.message || err));
    }
  }

  async function handleReview(e) {
    e.preventDefault();
    try {
      await API.submitReview({ rating, review: reviewText, user: auth?.email || "guest" });
      setMessage("Thanks for your feedback!");
      setRating(8);
      setReviewText("");
    } catch (err) {
      setMessage(String(err.message || err));
    }
  }

  return (
    <div style={{ fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial", color: "#111" }}>
      {/* Header */}
      <header style={{ position: "sticky", top: 0, background: "#003300", color: "#fff", padding: "12px 18px", zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 20 }}>CarX</div>
          <nav style={{ display: "flex", gap: 12 }}>
            <a href="#home" style={{ color: "#fff" }}>Home</a>
            <a href="#cars" style={{ color: "#fff" }}>Cars</a>
            <a href="#booking" style={{ color: "#fff" }}>Booking</a>
            <a href="#about" style={{ color: "#fff" }}>About</a>
            <a href="#support" style={{ color: "#fff" }}>Customer Service</a>
            <a href="#auth" style={{ color: "#fff" }}>{auth ? auth.email : "Login/Signup"}</a>
          </nav>
        </div>
      </header>

      {/* HOME */}
      <Section id="home" bg={heroBg} title="CarX" subtitle="Mission: Make premium mobility accessible. Vision: Sustainable, data-driven car buying.">
        <Card>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: 6 }}>Find your perfect car — faster.</h3>
              <p style={{ marginBottom: 10 }}>CarX curates the best cars across brands with transparent specs, fair pricing, and guided viewings.</p>
              <div style={{ display: "flex", gap: 8 }}>
                <a href="#cars"><button style={{ padding: "8px 14px", background: "#006400", color: "#fff", border: "none", borderRadius: 8 }}>Browse Cars</button></a>
                <a href="#booking"><button style={{ padding: "8px 14px", background: "#fff", color: "#006400", border: "1px solid #006400", borderRadius: 8 }}>Book a Viewing</button></a>
              </div>
            </div>
            <img src="https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=900&auto=format&fit=crop" alt="cars" style={{ width: 340, borderRadius: 10 }} />
          </div>
        </Card>
      </Section>

      {/* CARS / MAIN */}
      <Section id="cars" bg={sectionBg} title="Available Cars" subtitle="Filter by brand, model, year, price and find your match.">
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ width: 280 }}>
            <Card>
              <h4>Filters</h4>
              <div style={{ marginTop: 8 }}>
                <label>Brand</label>
                <select value={filters.brand} onChange={(e) => setFilters((f) => ({ ...f, brand: e.target.value }))} style={{ width: "100%", padding: 8, marginTop: 6 }}>
                  {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>

                <label style={{ marginTop: 8 }}>Year</label>
                <select value={filters.year} onChange={(e) => setFilters((f) => ({ ...f, year: e.target.value }))} style={{ width: "100%", padding: 8, marginTop: 6 }}>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>

                <label style={{ marginTop: 8 }}>Transmission</label>
                <select value={filters.transmission} onChange={(e) => setFilters((f) => ({ ...f, transmission: e.target.value }))} style={{ width: "100%", padding: 8, marginTop: 6 }}>
                  <option>All</option>
                  <option>Automatic</option>
                  <option>Manual</option>
                </select>

                <label style={{ marginTop: 8 }}>Price Range (INR)</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => setFilters((f) => ({ ...f, minPrice: Number(e.target.value || 0) }))} style={{ flex: 1, padding: 8 }} />
                  <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value || 99999999) }))} style={{ flex: 1, padding: 8 }} />
                </div>

                <button onClick={() => setFilters({ brand: "All", year: "All", minPrice: 0, maxPrice: 99999999, transmission: "All" })} style={{ marginTop: 10, padding: "8px 12px", background: "#eee", border: "none", borderRadius: 8 }}>Reset</button>
              </div>
            </Card>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
              {filtered.map((c) => (
                <Card key={c.id}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <img src={c.img} alt={c.model} style={{ width: 160, height: 110, objectFit: "cover", borderRadius: 8 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                          <h4 style={{ margin: 0 }}>{c.brand} {c.model}</h4>
                          <div style={{ fontSize: 13, color: "#555" }}>{c.year} • {c.fuel}</div>
                        </div>
                        <div style={{ fontWeight: 700 }}>{inr(c.price)}</div>
                      </div>
                      <ul style={{ marginTop: 8, fontSize: 13, color: "#444" }}>
                        <li>Seats: {c.seats}</li>
                        <li>Transmission: {c.transmission}</li>
                        <li>Mileage: {c.mileage}</li>
                      </ul>
                      <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                        <button onClick={() => { setSelectedCar(c); setBookingForm((b) => ({ ...b, carId: c.id })); window.location.hash = "#booking"; }} style={{ background: "#006400", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 6 }}>Book Viewing</button>
                        <button onClick={() => alert(JSON.stringify(c, null, 2))} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ddd" }}>View Specs</button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {filtered.length === 0 && <div style={{ gridColumn: "1 / -1" }}><Card>No cars found for selected filters.</Card></div>}
            </div>
          </div>
        </div>
      </Section>

      {/* BOOKING */}
      <Section id="booking" bg={sectionBg} title="Book a Viewing" subtitle="Pick a car, choose a date, and our sales rep will call to confirm.">
        <Card>
          <form onSubmit={handleBook}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label>Car</label>
                <select value={bookingForm.carId} onChange={(e) => setBookingForm((b) => ({ ...b, carId: e.target.value }))} style={{ width: "100%", padding: 8 }}>
                  {cars.map((c) => <option key={c.id} value={c.id}>{c.brand} {c.model} ({c.year})</option>)}
                </select>
              </div>
              <div>
                <label>Date</label>
                <input type="date" required value={bookingForm.date} onChange={(e) => setBookingForm((b) => ({ ...b, date: e.target.value }))} style={{ width: "100%", padding: 8 }} />
              </div>
              <div>
                <label>Your name</label>
                <input required value={bookingForm.name} onChange={(e) => setBookingForm((b) => ({ ...b, name: e.target.value }))} placeholder="Full name" style={{ width: "100%", padding: 8 }} />
              </div>
              <div>
                <label>Phone</label>
                <input required value={bookingForm.phone} onChange={(e) => setBookingForm((b) => ({ ...b, phone: e.target.value }))} placeholder="+91 98xxxx" style={{ width: "100%", padding: 8 }} />
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <button type="submit" style={{ padding: "10px 14px", background: "#006400", color: "#fff", border: "none", borderRadius: 8 }}>Submit Booking</button>
              <span style={{ marginLeft: 12, color: "#006400" }}>{message}</span>
            </div>
          </form>
        </Card>
      </Section>

      {/* ABOUT */}
      <Section id="about" bg={aboutBg} title="About CarX" subtitle="Who we are, what we value, and what we deliver.">
        <Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <h4>Features</h4>
              <ul>
                <li>Curated listings with verified specs</li>
                <li>Guided viewings and paper work assistance</li>
                <li>Transparent pricing and inspection reports</li>
              </ul>
            </div>
            <div>
              <h4>Values</h4>
              <ul>
                <li>Customer-first honesty</li>
                <li>Data-driven recommendations</li>
                <li>Sustainability & electric-first incentives</li>
              </ul>
            </div>
            <div>
              <h4>Founders</h4>
              <p><strong>Ashwin Rao</strong> — Product & Ops<br/><strong>Neha Patel</strong> — Customer Experience<br/><strong>Abhiraj J</strong> — Tech & ML</p>
            </div>
          </div>
        </Card>
      </Section>

      {/* SUPPORT */}
      <Section id="support" bg={supportBg} title="Customer Service" subtitle="Rate us, leave a review, or call in an emergency.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <Card>
            <h4>Rate Us (1 - 10)</h4>
            <input type="range" min="1" max="10" value={rating} onChange={(e) => setRating(Number(e.target.value))} style={{ width: "100%" }} />
            <div>Selected: {rating}</div>
          </Card>
          <Card>
            <h4>Write a Review</h4>
            <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows={5} style={{ width: "100%", padding: 8 }} placeholder="Tell us what you liked or what we can improve" />
            <button onClick={handleReview} style={{ marginTop: 8, background: "#006400", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 8 }}>Submit Review</button>
          </Card>
          <Card>
            <h4>Emergency</h4>
            <div style={{ background: "#006400", color: "#fff", padding: "12px", borderRadius: 8, fontWeight: 700 }}>+91 1800-22-CARX (2279)</div>
            <p style={{ marginTop: 8 }}>For breakdowns, urgent appointments, or safety concerns.</p>
          </Card>
        </div>
      </Section>

      {/* AUTH */}
      <Section id="auth" bg={sectionBg} title="Login / Sign up" subtitle={USE_MOCK ? "Preview mode: no backend required" : "Connected to API"}>
        <Card>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, borderRight: "1px dashed #eee", paddingRight: 12 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setAuthMode("login")} style={{ padding: "8px 12px", background: authMode === "login" ? "#006400" : "#eee", color: authMode === "login" ? "#fff" : "#000" }}>Login</button>
                <button onClick={() => setAuthMode("signup")} style={{ padding: "8px 12px", background: authMode === "signup" ? "#006400" : "#eee", color: authMode === "signup" ? "#fff" : "#000" }}>Sign up</button>
              </div>

              {authMode === "login" ? (
                <form onSubmit={handleLogin} style={{ marginTop: 12 }}>
                  <input name="email" type="email" placeholder="Email" style={{ width: "100%", padding: 8, marginBottom: 8 }} required />
                  <input name="password" type="password" placeholder="Password" style={{ width: "100%", padding: 8 }} required />
                  <button type="submit" style={{ marginTop: 8, padding: "8px 12px", background: "#006400", color: "#fff", border: "none", borderRadius: 8 }}>Login</button>
                </form>
              ) : (
                <form onSubmit={handleSignup} style={{ marginTop: 12 }}>
                  <input name="name" placeholder="Full name" style={{ width: "100%", padding: 8, marginBottom: 8 }} required />
                  <input name="email" type="email" placeholder="Email" style={{ width: "100%", padding: 8, marginBottom: 8 }} required />
                  <input name="password" type="password" placeholder="Password" style={{ width: "100%", padding: 8 }} required />
                  <button type="submit" style={{ marginTop: 8, padding: "8px 12px", background: "#006400", color: "#fff", border: "none", borderRadius: 8 }}>Sign up</button>
                </form>
              )}
            </div>

            <div style={{ flex: 1, paddingLeft: 12 }}>
              <h4>Account</h4>
              {auth ? (
                <div>
                  <p>Logged in as <strong>{auth.email}</strong></p>
                  <button onClick={() => { setAuth(null); localStorage.removeItem("carx_auth"); }} style={{ marginTop: 8, background: "#ff4d4f", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 8 }}>Logout</button>
                </div>
              ) : (
                <p>Login to book faster and view your bookings.</p>
              )}
            </div>
          </div>
        </Card>
      </Section>

      {/* FOOTER */}
      <footer style={{ background: "#003300", color: "#fff", padding: 24 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 800 }}>CarX</div>
            <div>Turnkey car buying & viewing experience</div>
          </div>
          <div>© {new Date().getFullYear()} CarX</div>
        </div>
      </footer>
    </div>
  );
}


export default App
