"use client";

import Moment from "react-moment";
import { Clock1, PenTool } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Button } from "@/components/ui/button";

type FileCardProps = {
  name: string;
  url: string;
  img: string;
  createdAt: Date;
  lastEditedAt: Date | undefined;
};

const FileCard = (props: FileCardProps) => {
  const { name, url, img, lastEditedAt, createdAt } = props;
  const router = useRouter();
  // @ts-expect-error
  const open = () => router.push(url);

  return (
    <Card className="group overflow-hidden">
      <CardContent className="relative !p-0">
        <img
          onDoubleClick={open}
          className="aspect-video object-cover border-b"
          src={img}
        />
        <Button
          className="opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity absolute top-0 right-0 m-5"
          variant="outline"
          size="icon"
          onClick={open}
        >
          <PenTool size={16} />
        </Button>
      </CardContent>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <div className="flex items-center justify-between gap-2">
          <span>{lastEditedAt ? "Edited" : "Created"}</span>
          <span className="ms-auto">
            <Clock1 size={12} />
          </span>
          {lastEditedAt ? (
            <Moment date={lastEditedAt} fromNow />
          ) : (
            <Moment date={createdAt} fromNow />
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

export default FileCard;
