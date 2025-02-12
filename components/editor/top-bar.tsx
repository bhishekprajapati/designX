import { ModeToggle } from "@/components/mode-toggle";
import { PresenceAvatars } from "@components/presence";
import EditorSyncStatus from "./sync-status";
import { WhenLargeScreen } from "../screens";

const TopBar = () => {
  return (
    <div className="p-3 flex items-center gap-3">
      <img className="scale-75" src="/favicon-32x32.png" />
      <span className="font-bold tracking-wide bg-gradient-to-r from-pink-400 via-red-400 to-purple-300 bg-clip-text text-transparent text-xl">
        DesignX
      </span>
      <WhenLargeScreen>
        <EditorSyncStatus className="ms-4" />
      </WhenLargeScreen>
      <span className="ms-auto" />
      <WhenLargeScreen>
        <PresenceAvatars />
      </WhenLargeScreen>
      <ModeToggle />
    </div>
  );
};

export default TopBar;
