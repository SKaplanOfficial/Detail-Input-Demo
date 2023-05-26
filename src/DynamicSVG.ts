export interface Coordinate {
  x: number;
  y: number;
}

export interface SVGItem {
  type: string;
  position: Coordinate;
  dimensions: { w: number; h: number };
}

export interface ClickableItem extends SVGItem {
  onClick: () => void;
}

export interface ClickableText extends ClickableItem {
  text: string;
  color?: string;
}

export interface ClickableTextOptions {
  color?: string;
}

export interface ClickableImage extends ClickableItem {
  source: string;
}

export interface ClickableCircle extends ClickableItem {
  radius: number;
  color?: string;
}

export interface ClickableCircleOptions {
  color?: string;
}

export interface ClickableRectangle extends ClickableItem {
  color?: string;
  rx?: number;
  ry?: number;
}

export interface ClickableRectangleOptions {
  color?: string;
  rounding?: number;
  rx?: number;
  ry?: number;
}

export function text(
  text: string,
  position: [number, number],
  onClick: () => void,
  options?: ClickableTextOptions
): ClickableText {
  const dimensions = {
    w: 8 * Math.max(...text.split("\n").map((line) => line.length)),
    h: 20 * text.split("\n").length,
  };
  const item: ClickableText = {
    type: "text",
    text: text,
    position: { x: position[0], y: position[1] },
    dimensions: dimensions,
    onClick: onClick,
    color: options?.color || "black",
  };
  return item;
}

export function image(
  source: string,
  position: [number, number],
  dimensions: [number, number],
  onClick: () => void
): ClickableImage {
  const item: ClickableImage = {
    type: "image",
    source: source,
    position: { x: position[0], y: position[1] },
    dimensions: { w: dimensions[0], h: dimensions[1] },
    onClick: onClick,
  };
  return item;
}

export function circle(
  position: [number, number],
  radius: number,
  onClick: () => void,
  options?: ClickableCircleOptions
): ClickableCircle {
  const item: ClickableCircle = {
    type: "circle",
    position: { x: position[0], y: position[1] },
    dimensions: { w: radius * 2, h: radius * 2 },
    radius: radius,
    onClick: onClick,
    color: options?.color || "black",
  };
  return item;
}

export function rect(
  position: [number, number],
  dimensions: [number, number],
  onClick: () => void,
  options?: ClickableRectangleOptions
): ClickableRectangle {
  const item: ClickableRectangle = {
    type: "rectangle",
    position: { x: position[0], y: position[1] },
    dimensions: { w: dimensions[0], h: dimensions[1] },
    onClick: onClick,
    color: options?.color || "black",
    rx: options?.rx || options?.rounding || 0,
    ry: options?.ry || options?.rounding || 0,
  };
  return item;
}

export class DynamicSVG {
  public width: number;
  public height: number;
  public items: SVGItem[];
  public scenes: SVGItem[][];
  public tick = 0;

  public constructor(width: number, height: number, items?: SVGItem[], scenes?: SVGItem[][]) {
    this.width = width;
    this.height = height;
    this.items = items || [];
    this.scenes = scenes || [];
    if (this.items.length > 0) {
      this.scenes.unshift(this.items);
    }
  }

  public nextScene(): void {
    this.tick++;
  }

  public previousScene(): void {
    this.tick--;
  }

  public setScene(index: number): void {
    this.tick = index;
  }

  public toString(): string {
    const svgItems = this.scenes[this.tick]
      .map((item) => {
        if (item.type === "text") {
          const text = item as ClickableText;
          return `<text x="${text.position.x}" y="${text.position.y}" fill="${text.color}">${text.text}</text>`;
        } else if (item.type === "image") {
          const image = item as ClickableImage;
          return `<image href="${image.source}" x="${image.position.x}" y="${image.position.y}" width="${image.dimensions.w}" height="${image.dimensions.h}"/>`;
        } else if (item.type === "circle") {
          const circle = item as ClickableCircle;
          return `<circle cx="${circle.position.x + circle.radius}" cy="${circle.position.y}" r="${
            circle.radius
          }" fill="${circle.color}"/>`;
        } else if (item.type === "rectangle") {
          const rect = item as ClickableRectangle;
          return `<rect x="${rect.position.x}" y="${rect.position.y}" width="${rect.dimensions.w}" height="${rect.dimensions.h}" fill="${rect.color}" rx="${rect.rx}" ry="${rect.ry}">
                    <animate
                        attributeName="rx"
                        values="0;5;0"
                        dur="10s"
                        repeatCount="indefinite" />
                  </rect>`;
        }
      })
      .join("");

    return `<svg height="${this.height}" width="${this.width}">${svgItems}</svg>`;
  }
}
