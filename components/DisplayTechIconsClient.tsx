"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import { cn, getTechLogos } from "@/lib/utils";

interface TechIconProps {
  techStack: string[];
}

interface TechIcon {
  tech: string;
  url: string;
}

const DisplayTechIconsClient = ({ techStack }: TechIconProps) => {
  const [techIcons, setTechIcons] = useState<TechIcon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechIcons = async () => {
      try {
        const icons = await getTechLogos(techStack);
        setTechIcons(icons);
      } catch (error) {
        console.error("Error fetching tech icons:", error);
        // Fallback to empty array if there's an error
        setTechIcons([]);
      } finally {
        setLoading(false);
      }
    };

    if (techStack && techStack.length > 0) {
      fetchTechIcons();
    } else {
      setLoading(false);
    }
  }, [techStack]);

  if (loading) {
    return (
      <div className="flex flex-row gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-9 h-9 bg-muted rounded-full animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (techIcons.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 bg-muted rounded-full" />
        <span>No technologies specified</span>
      </div>
    );
  }

  return (
    <div className="flex flex-row">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            "relative group bg-muted rounded-full p-2 flex flex-center",
            index >= 1 && "-ml-3"
          )}
        >
          <span className="tech-tooltip">{tech}</span>

          <Image
            src={url}
            alt={tech}
            width={20}
            height={20}
            className="size-5"
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIconsClient;

