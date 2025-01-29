import { ModeToggle } from "@/components/mode-toggle";
import { PresenceAvatars } from "./presence";
import ShareButton from "./share-button";

const TopBar = () => {
  return (
    <div className="p-3 flex items-center gap-3">
      <img className="scale-75" src="/favicon-32x32.png" />
      <span className="font-bold tracking-wide bg-gradient-to-r from-purple-400 via-red-400 to-blue-400 bg-clip-text text-transparent text-xl">
        DesignX
      </span>
      <span className="ms-auto" />
      <PresenceAvatars />
      {/* <ShareButton /> */}
      <ModeToggle />
    </div>
  );
};

export default TopBar;
