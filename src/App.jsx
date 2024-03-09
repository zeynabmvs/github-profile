import { useState } from "react";
import "./App.css";
import { user_data } from "./data.js";

function Profile() {
  return (
    <div className="profile -mt-11">
      <div className="flex items-end gap-12 pb-5">
        <div className="bg-gray p-2 rounded-2xl">
          <img
            src={user_data.avatar_url}
            alt=""
            className="rounded-xl w-[104px] h-[104px]"
          />
        </div>
        <div className="flex pb-3 gap-5">
          <div className="bg-darkgray rounded-xl text-slate-200 h-[52px] py-2 px-9 flex items-center justify-center">
            Followers<span className="block h-9 w-px mx-9 bg-slate-200"></span>
            <span className="text-slate-100">{user_data.followers}</span>
          </div>
          <div className="bg-darkgray rounded-xl text-slate-200 h-[52px] py-2 px-9 flex items-center justify-center">
            Following<span className="block h-9 w-px mx-9 bg-slate-200"></span>
            <span className="text-slate-100">{user_data.following}</span>
          </div>
          <div className="bg-darkgray rounded-xl text-slate-200 h-[52px] py-2 px-9 flex items-center justify-center">
            Location<span className="block h-9 w-px mx-9 bg-slate-200"></span>
            <span className="text-slate-100">{user_data.location}</span>
          </div>
        </div>
      </div>
      <h2 className="capitalize text-2base pb-2 text-slate-100">{user_data.login}</h2>
      <span className="text-slate-100">{user_data.bio}</span>
    </div>
  );
}

function SearchForm() {
  return "";
}

function Header() {
  return (
    <div
      id="header"
      className="h-[240px] w-full bg-center bg-cover bg-no-repeat bg-[url('/hero-image-github-profile.png')]"
    >
      <SearchForm />
    </div>
  );
}

function App() {
  return (
    <>
      <Header />
      <div className="container">
        <Profile />
      </div>
    </>
  );
}

export default App;
