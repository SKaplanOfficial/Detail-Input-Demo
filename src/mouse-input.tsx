import { Color, open } from "@raycast/api";
import { useEffect, useState } from "react";
import { DynamicSVG, circle, image, rect, text } from "./DynamicSVG";
import ClickableDetail from "./ClickableDetail";

export default function Command() {
  const [initialSVG, setInitialSVG] = useState<DynamicSVG>();

  useEffect(() => {
    // Basic interface
    setInitialSVG(
      new DynamicSVG(750, 365, [
        text("Hello World", [15, 15], () => open("https://raycast.com"), { color: "blue" }),
        rect([15, 50], [100, 100], () => open("https://google.com"), { color: "red" }),
        circle([150, 100], 50, () => open("https://bing.com"), { color: Color.Magenta }),
      ])
    );

    // Move between scenes
    // const svg = new DynamicSVG(750, 365)
    // svg.scenes = [
    //     ...[0,1,2,3,4,5,6,7,8,9,10].map((x) => [text("Click me!", [15 * x, 15], () => svg.nextScene(), { color: "blue" })]),
    //     [
    //         rect([15, 50], [100, 100], () => open("https://google.com"), { color: "red" }),
    //         circle([150, 100], 50, () => svg.setScene(4), { color: Color.Magenta }),
    //     ],
    // ]
    // setInitialSVG(svg);
  }, []);

  return <ClickableDetail SVG={initialSVG} />;
}
