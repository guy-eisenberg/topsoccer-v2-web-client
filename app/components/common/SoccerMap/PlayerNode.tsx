import type { Topsoccer } from "@/types";
import { cn } from "@heroui/theme";
import interact from "interactjs";
import { useEffect, useMemo } from "react";
import PlayerAvatar from "../PlayerAvatar";

interface PlayerNodeProps extends React.HTMLAttributes<HTMLDivElement> {
  player: Topsoccer.Event.Map;
  onPlayerMove: (x: number, y: number) => void;
  enableEdit?: boolean;
}

const PlayerNode: React.FC<PlayerNodeProps> = ({
  player,
  onPlayerMove,
  enableEdit = false,
  ...rest
}) => {
  const finalId = useMemo(() => {
    return `player-node-${player.user_id}`;
  }, [player.user_id]);

  useEffect(() => {
    if (!enableEdit) return;

    interact(`#${finalId}`).draggable({
      inertia: false,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "parent",
          endOnly: true,
        }),
      ],
      listeners: {
        move: dragMoveListener,
        // end(event) {
        //   var textEl = event.target.querySelector("p");

        //   textEl &&
        //     (textEl.textContent =
        //       "moved a distance of " +
        //       Math.sqrt(
        //         (Math.pow(event.pageX - event.x0, 2) +
        //           Math.pow(event.pageY - event.y0, 2)) |
        //           0
        //       ).toFixed(2) +
        //       "px");
        // },
      },
    });

    function dragMoveListener(event: any) {
      const target = event.target;

      // keep the dragged position in the data-x/data-y attributes
      const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
      const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

      // translate the element
      //   target.style.transform = "translate(" + x + "px, " + y + "px)";
      onPlayerMove(x, y);

      // update the posiion attributes
      target.setAttribute("data-x", x);
      target.setAttribute("data-y", y);
    }
  }, [enableEdit, finalId, onPlayerMove]);

  return (
    <div
      {...rest}
      id={finalId}
      className={cn(
        "absolute flex h-12 w-12 cursor-pointer touch-none select-none items-center justify-center rounded-full active:z-10 active:shadow-md",
        rest.className,
      )}
      style={{
        backgroundColor: groupToColor(player.group),
        ...rest.style,
      }}
    >
      <PlayerAvatar
        className="pointer-events-none h-10 w-10 select-none rounded-full"
        src={player.image}
      />
      {player.name && (
        <p className="absolute top-full mt-1 whitespace-nowrap border bg-black/40 p-[2px] text-xs text-white">
          {player.is_mvp && "👑"} {player.name} {player.is_mvp && "👑"}
        </p>
      )}
    </div>
  );

  function groupToColor(group: Topsoccer.Group.Name | null) {
    switch (group) {
      case "Black":
        return "#545454";
      case "Blue":
        return "#1A7EFF";
      case "Green":
        return "#97CE00";
      case "Orange":
        return "#FF9D00";
      case "Pink":
        return "#FF0080";
      case "Red":
        return "#FF0000";
      case "White":
        return "#FFFFFFCC";
      case "Yellow":
        return "#CEC800";
      default:
        return "#2eac68";
    }
  }
};

export default PlayerNode;
