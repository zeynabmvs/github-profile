import { useState } from "react";
import Profile from "./components/Profile";
import Repos from "./components/Repos";
import Header from "./components/Header";
import { SkeletonTheme } from "react-loading-skeleton";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState("github");

  const handleProfileClick = (newUsername) => {
    setUsername(newUsername); // Update the username state with the new username
    setSearchQuery("");
  };

  return (
    <>
      <SkeletonTheme baseColor="#364153" highlightColor="#4A5567" duration={2}>
        <Header
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onProfileClick={handleProfileClick}
        />
        <div className="container px-4">
          <Profile username={username} />
          <Repos username={username} />
        </div>
      </SkeletonTheme>
    </>
  );
}

export default App;
