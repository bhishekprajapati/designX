import { Share2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ShareButtonProps = ButtonProps;
const ShareButton = (props: ShareButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="secondary" size="sm" {...props}>
          Share
          <Share2 size={8} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share this file</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ShareButton;
