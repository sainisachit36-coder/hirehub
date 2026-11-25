import { useState, useEffect } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { auth, db } from "./firebase";

import "./App.css";
  

const initialFreelancers = [
  { id: 1, name: "Alex Morgan", role: "Frontend Developer", skills: ["React", "JavaScript", "CSS"], rate: 25, rating: "4.9", projects: 32, initials: "AM", color: "purple" },
  { id: 2, name: "Sophia Lee", role: "UI/UX Designer", skills: ["Figma", "UI Design", "Prototyping"], rate: 30, rating: "5.0", projects: 48, initials: "SL", color: "pink" },
  { id: 3, name: "Daniel Khan", role: "Video Editor", skills: ["Premiere Pro", "After Effects", "Reels"], rate: 20, rating: "4.8", projects: 26, initials: "DK", color: "blue" },
  { id: 4, name: "Emma Wilson", role: "Graphic Designer", skills: ["Photoshop", "Illustrator", "Branding"], rate: 22, rating: "4.9", projects: 41, initials: "EW", color: "orange" },
];

const categories = ["All Talent", "Development", "Design", "Video Editing"];

function App() {
 
const [editProfile, setEditProfile] = useState({
  fullName: "",
  profession: "",
  skills: "",
  hourlyRate: ""
});
const [showEditProfile, setShowEditProfile] = useState(false);
const saveProfile = async () => {
  if (!auth.currentUser) {
    alert("Please login first!");
    return;
  }

  try {
    await setDoc(
      doc(db, "profiles", auth.currentUser.uid),
      {
      ...editProfile,

                updatedAt: new Date()
      },
      { merge: true }
    );

    alert("Profile saved successfully!");
    setShowEditProfile(false);
  } catch (error) {
    alert(error.message);
  }
};
  const [currentUser, setCurrentUser] = useState(null);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setCurrentUser(user);
  });

  return () => unsubscribe();
}, []);
useEffect(() => {
  const loadProfile = async () => {
    if (!currentUser) return;

    try {
      const profileRef = doc(db, "profiles", currentUser.uid);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        const data = profileSnap.data();

        setEditProfile({
          fullName: data.fullName || "",
          profession: data.profession || "",
          skills: data.skills || "",
          hourlyRate: data.hourlyRate || ""
        });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  loadProfile();
}, [currentUser]);
  const [freelancers, setFreelancers] = useState(initialFreelancers);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Talent");
  const [modal, setModal] = useState("");
  const [selected, setSelected] = useState(null);

  const [profile, setProfile] = useState({
    name: "",
    role: "",
    skills: "",
    rate: "",
  });

  const filtered = freelancers.filter((person) => {
    const matchesSearch =
      `${person.name} ${person.role} ${person.skills.join(" ")}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "All Talent" ||
      (category === "Development" && person.role.toLowerCase().includes("developer")) ||
      (category === "Design" && person.role.toLowerCase().includes("designer")) ||
      (category === "Video Editing" && person.role.toLowerCase().includes("video"));

    return matchesSearch && matchesCategory;
  });

  function createProfile(e) {
    e.preventDefault();

    const initials = profile.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    setFreelancers((old) => [
      ...old,
      {
        id: Date.now(),
        name: profile.name,
        role: profile.role,
        skills: profile.skills.split(",").map((skill) => skill.trim()),
        rate: Number(profile.rate),
        rating: "New",
        projects: 0,
        initials,
        color: "purple",
      },
    ]);

    setProfile({ name: "", role: "", skills: "", rate: "" });
    setModal("");
    setCategory("All Talent");
    setSearch("");
    alert("Profile created successfully!");
  }

  return (
    <div className="app">
      <nav className="navbar">
        <a href="#home" className="logo">hire<span>hub.</span></a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#talent">Find Talent</a>
          <a href="#how">How it works</a>
        </div>

        <div className="nav-actions">

  {currentUser ? (
    <>
      <span className="login-btn">
        {currentUser.email}
      </span>
      <button
        className="primary-btn nav-signup"
        onClick={async () => {
          await signOut(auth);
          alert("Logged out successfully!");
        }}
      >
        Logout
      </button>
      <button
  className="login-btn"
  onClick={() => setModal("editProfile")}
>
  Edit Profile
</button>
    </>
  ) : (
    <>
      <button className="login-btn" onClick={() => setModal("login")}>
        Log in
      </button>
      <button className="primary-btn nav-signup" onClick={() => setModal("signup")}>
        Get Started <span>↗</span>
      </button>
    </>
  )}
</div>


      </nav>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="eyebrow"><span className="live-dot"></span> THE FUTURE OF FREELANCING</div>

            <h1>Great work starts<br />with <span>great people.</span></h1>

            <p className="hero-description">
              Discover talented freelancers, collaborate with experts,
              and turn your next big idea into reality.
            </p>

            <div className="hero-search">
              <span>⌕</span>
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCategory("All Talent");
                }}
                placeholder="Search skills, experts, services..."
              />
              <button onClick={() => document.getElementById("talent").scrollIntoView({ behavior: "smooth" })}>
                Search Talent
              </button>
            </div>

            <div className="hero-bottom">
              <div className="avatar-stack">
                <span>AM</span><span>SL</span><span>DK</span><span>+</span>
              </div>
              <p><strong>10,000+</strong> professionals ready to work</p>
            </div>
          </div>

          <div className="hero-art">
            <div className="art-glow"></div>
            <div className="floating-card top-card">
              <span className="status-dot"></span> Available for work
            </div>
            <div className="hero-profile-card">
              <div className="hero-profile-avatar">✦</div>
              <div className="profile-stars">★★★★★</div>
              <h3>Creative minds.</h3>
              <p>Exceptional talent, one place.</p>
              <div className="mini-tags"><span>Design</span><span>Code</span><span>Ideas</span></div>
            </div>
            <div className="floating-card bottom-card">
              <span className="check-icon">✓</span>
              Work made simple
            </div>
          </div>
        </section>

        <section className="stats">
          <div><h2>10k<span>+</span></h2><p>Freelancers</p></div>
          <div><h2>5k<span>+</span></h2><p>Projects completed</p></div>
          <div><h2>120<span>+</span></h2><p>Countries</p></div>
          <div><h2>4.9<span>/5</span></h2><p>Average rating</p></div>
        </section>

        <section className="talent-section" id="talent">
          <div className="section-heading">
            <div>
              <div className="eyebrow">MEET THE EXPERTS</div>
              <h2>Find your next <span>great hire.</span></h2>
              <p>Work with talented people who bring your ideas to life.</p>
            </div>
            <button className="outline-btn" onClick={() => setModal("profile")}>＋ Create Profile</button>
          </div>

          <div className="category-list">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "category active" : "category"}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="freelancer-grid">
            {filtered.map((person) => (
              <article className="freelancer-card" key={person.id}>
                <div className="card-top">
                  <div className={`person-avatar ${person.color}`}>{person.initials}</div>
                  <span className="available"><span></span> Available</span>
                </div>

                <h3>{person.name}</h3>
                <p className="person-role">{person.role}</p>

                <div className="skill-tags">
                  {person.skills.map((skill) => <span key={skill}>{skill}</span>)}
                </div>

                <div className="person-info">
                  <span>★ {person.rating}</span>
                  <span>{person.projects} projects</span>
                </div>

                <div className="card-footer">
                  <div><strong>${person.rate}</strong><small> / hour</small></div>
                  <button onClick={() => setSelected(person)}>View Profile ↗</button>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && <p className="empty">No freelancers found. Try another search.</p>}
        </section>

        <section className="how-section" id="how">
          <div className="eyebrow">SIMPLE PROCESS</div>
          <h2>Make great things <span>happen.</span></h2>
          <div className="steps">
            <div><span>01</span><h3>Discover talent</h3><p>Find the right professional for your project.</p></div>
            <div><span>02</span><h3>Connect & collaborate</h3><p>Discuss your ideas and plan your work.</p></div>
            <div><span>03</span><h3>Get things done</h3><p>Bring your vision to life with great people.</p></div>
          </div>
        </section>

        <section className="cta-section">
          <div><div className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</div><h2>Ready to do your best work?</h2><p>Join HireHub and connect with opportunities.</p></div>
          <button className="primary-btn" onClick={() => setModal("profile")}>Join HireHub ↗</button>
        </section>
      </main>

      <footer className="footer">
        <a href="#home" className="logo">hire<span>hub.</span></a>
        <p>Good people. Great work. Better future.</p>
        <span>© 2026 HireHub</span>
      </footer>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelected(null)}>×</button>
            <div className={`person-avatar large ${selected.color}`}>{selected.initials}</div>
            <h2>{selected.name}</h2>
            <p className="person-role">{selected.role}</p>
            <p className="modal-skills">Skills: {selected.skills.join(", ")}</p>
            <h3>${selected.rate} / hour</h3>
            <p>★ {selected.rating} rating · {selected.projects} projects</p>
            <button className="primary-btn full-btn" onClick={() => alert("Messaging feature will be connected later.")}>Contact Freelancer ↗</button>
          </div>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal("")}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setModal("")}>×</button>
            <div className="eyebrow">WELCOME TO HIREHUB</div>
            <h2>{modal === "profile" ? "Create your profile" : modal === "signup" ? "Create your account" : "Welcome back"}</h2>
            <p className="modal-description">
              {modal === "profile" ? "Show the world what you can do." : "Your next opportunity starts here."}
            </p>

{modal === "editProfile" ? (
  <form onSubmit={(e) => {
    e.preventDefault();
    saveProfile();
  }}>
    <input
      required
      placeholder="Full name"
      value={editProfile.fullName}
      onChange={(e) => setEditProfile({ ...editProfile, fullName: e.target.value })}
    />

    <input
      required
      placeholder="Your profession"
      value={editProfile.profession}
      onChange={(e) => setEditProfile({ ...editProfile, profession: e.target.value })}
    />

    <input
      required
      placeholder="Skills (comma separated)"
      value={editProfile.skills}
      onChange={(e) => setEditProfile({ ...editProfile, skills: e.target.value })}
    />

    <input
      required
      type="number"
      min="1"
      placeholder="Hourly rate in USD"
      value={editProfile.hourlyRate}
      onChange={(e) => setEditProfile({ ...editProfile, hourlyRate: e.target.value })}
    />

    <button className="primary-btn full-btn" type="submit">
      Save Profile ↗
    </button>
  </form>
) : modal === "profile" ? (
              <form onSubmit={createProfile}>
                <input required placeholder="Full name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                <input required placeholder="Your profession" value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} />
                <input required placeholder="Skills (comma separated)" value={profile.skills} onChange={(e) => setProfile({ ...profile, skills: e.target.value })} />
                <input required type="number" min="1" placeholder="Hourly rate in USD" value={profile.rate} onChange={(e) => setProfile({ ...profile, rate: e.target.value })} />
                <button className="primary-btn full-btn" type="submit">Create Profile ↗</button>
              </form>
            ) : (
             <form onSubmit={async (e) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    if (modal === "signup") {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

await setDoc(doc(db, "profiles", user.uid), {
  fullName: formData.get("fullName"),
  email: email,
  createdAt: new Date()
});
      alert("Account created successfully!");
    } else {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
    }

    setModal("");
  } catch (error) {
    alert(error.message);
  }
}}>
                {modal === "signup" && <input required name="fullName" placeholder="Full name" />}
                <input required name="email" type="email" placeholder="Email address" />
                <input required name="password" type="password" placeholder="Password" minLength="6" />
                <button className="primary-btn full-btn" type="submit">{modal === "signup" ? "Create Account ↗" : "Log in ↗"}</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
