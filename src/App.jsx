import { useState } from "react";
import "./App.css";
import Profile from "./components/Profile";
import Repos from "./components/Repos";
import Header from "./components/Header";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState("github");

  const handleSearchSubmit = () => {
    console.log("search submitted", searchQuery);
  };

  const handleProfileClick = (newUsername) => {
    console.log("profile clicked", newUsername);
    setUsername(newUsername); // Update the username state with the new username
    setSearchQuery("");
    console.log(searchQuery);
  };

  return (
    <>
      <Header
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onProfileClick={handleProfileClick}
      />
      <div className="container px-4">
        <Profile username={username} />
        <Repos username={username} />
      </div>
    </>
  );
}

export default App;

