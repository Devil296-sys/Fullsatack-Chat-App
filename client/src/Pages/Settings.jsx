import React from "react";
import { useAuthStore } from "../Store/AuthStore";
import { THEMES } from "../lib/ThemesList";
const Settings = () => {
  const { setTheme } = useAuthStore();
  return (
    <>
      <div className="min-h-screen flex justify-center items-center flex-col">
        <h1 className="text-xl font-bold text-primary">Themes</h1>
        <div className="flex flex-wrap h-[100px] w-full md:w-[900px] items-center justify-center gap-2 p-4 ">
          {THEMES.map((theme) => (
            <button
              key={theme}
              className="px-4 py-2 text-base btn btn-primary flex-1"
              onClick={() => setTheme(theme)}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Settings;
