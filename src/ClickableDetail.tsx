import { Detail, environment } from "@raycast/api";
import { useEffect, useRef, useState } from "react";
import { execScript } from "./utils";
import path from "path";
import { DynamicSVG } from "./DynamicSVG";

export default function ClickableDetail(props: { SVG?: DynamicSVG }) {
  const { SVG } = props;
  const [svgView, setSVGView] = useState<string>("");
  const cooldown = useRef(false);

  useEffect(() => {
    const svgString = SVG?.toString() || "";
    setSVGView(
      svgString == "" ? "" : `<img src="${encodeURI(`data:image/svg+xml;utf8,${svgString}`).replaceAll('"', "'")}">`
    );

    const scriptPath = path.resolve(environment.assetsPath, "MouseInput.scpt");
    execScript(scriptPath, [], "JavaScript", (output) => {
      const coords = output.split(",");
      if (coords.length !== 2) {
        return;
      }

      const x = parseInt(coords[0]);
      const y = parseInt(coords[1]);

      if (SVG && SVG.scenes.length > 0) {
        const items = SVG.scenes[SVG.tick];
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (
            x > 15 + item.position.x &&
            x < 15 + item.position.x + item.dimensions.w &&
            y > item.position.y - 15 &&
            y < item.position.y + item.dimensions.h - 15
          ) {
            if ("onClick" in item && typeof item.onClick === "function" && !cooldown.current) {
              item.onClick();
              const svgString = SVG?.toString() || "";
              setSVGView(
                svgString == ""
                  ? ""
                  : `<img src="${encodeURI(`data:image/svg+xml;utf8,${svgString}`).replaceAll('"', "'")}">`
              );
              cooldown.current = true;
              setTimeout(() => {
                cooldown.current = false;
              }, 10);

              break;
            }
          }
        }
      }
    });
  }, [SVG, SVG?.tick, cooldown.current]);

  return <Detail markdown={svgView} />;
}
