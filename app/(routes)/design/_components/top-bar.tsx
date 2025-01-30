import { ModeToggle } from "@/components/mode-toggle";
import { PresenceAvatars } from "./presence";

const TopBar = () => {
  return (
    <div className="p-3 flex items-center gap-3">
      <img className="scale-75" src="/favicon-32x32.png" />
      <span className="font-bold tracking-wide bg-gradient-to-r from-pink-400 via-red-400 to-purple-300 bg-clip-text text-transparent text-xl">
        DesignX
      </span>
      <span className="ms-auto" />
      <PresenceAvatars />
      <ModeToggle />
    </div>
  );
};

export default TopBar;
