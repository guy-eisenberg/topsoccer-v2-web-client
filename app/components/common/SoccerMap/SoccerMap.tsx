import type { Topsoccer } from "@/types";
import { Skeleton } from "@heroui/skeleton";
import { cn } from "@heroui/theme";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PlayerNode from "./PlayerNode";

interface SoccerMapProps extends React.HTMLAttributes<HTMLDivElement> {
  players: Topsoccer.Event.Map[];
  updatePlayers?: (players: Topsoccer.Event.Map[]) => void;
  enableEdit?: boolean;
}

const ASPECT_RATIO = 1401 / 980;

const SoccerMap: React.FC<SoccerMapProps> = ({
  players,
  updatePlayers,
  enableEdit = false,
  ...rest
}) => {
  const container = useRef<HTMLDivElement>(null);

  const [loaded, setLoaded] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!container.current) return;

    setDimensions({
      width: container.current.clientWidth,
      height: container.current.clientHeight,
    });

    const observer = new ResizeObserver((changes) => {
      setLoaded(true);

      changes.forEach((change) => {
        setDimensions({
          width: change.contentRect.width,
          height: change.contentRect.height,
        });
      });
    });

    observer.observe(container.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      {...rest}
      dir="ltr"
      className={cn(rest.className, "relative")}
      style={{ paddingTop: `calc(${ASPECT_RATIO} * 100%)` }}
    >
      <Skeleton className="absolute inset-0" isLoaded={loaded}>
        <div className="absolute bottom-0 left-0 right-0 top-0" ref={container}>
          <Image
            alt="soccer field"
            className="select-none"
            fill
            src="/images/soccer-map.png"
          />
          <div className="absolute inset-0">
            {players.map((player) => {
              const { x, y } = getPlayerCoordPosition(player);

              return (
                <PlayerNode
                  player={player}
                  onPlayerMove={(x, y) => onPlayerMove(player, x, y)}
                  enableEdit={enableEdit}
                  style={{
                    top: 0,
                    left: 0,
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                  data-x={x}
                  data-y={y}
                  key={player.user_id}
                />
              );
            })}
          </div>
        </div>
      </Skeleton>
    </div>
  );

  function onPlayerMove(player: Topsoccer.Event.Map, x: number, y: number) {
    const { width, height } = dimensions;

    const newX = x / width;
    const newY = y / height;

    player.x = newX;
    player.y = newY;

    if (updatePlayers) updatePlayers([...players]);
  }

  function getPlayerCoordPosition(player: Topsoccer.Event.Map) {
    const { width, height } = dimensions;

    return {
      x: player.x * width,
      y: player.y * height,
    };
  }
};

export default SoccerMap;
