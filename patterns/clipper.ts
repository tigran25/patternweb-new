import Clipper from "clipper-js";

type Point = [number, number]

const multiplier = 1e6;
const toClipper = p => ({ X: p[0] * multiplier, Y: p[1] * multiplier });
const fromClipper = c => ([c.X / multiplier, c.Y / multiplier]);

export const offset = (delta:number) => (points:Point[]):Point[] => {
  const newPoints = points.map(toClipper);
  const subject = new Clipper([newPoints], true);
  const newShape = subject.offset(delta * multiplier, {
    jointType: "jtMiter",
    endType: "etClosedPolygon",
    miterLimit: Infinity,
    roundPrecision: 0
  });
  const outPath = newShape.paths[0] || [];
  return outPath.map(fromClipper);
}

export const area = (outline:Point[]):number => {
  const outlinePoints = outline.map(toClipper);
  const shape = new Clipper([outlinePoints], true);
  const rawArea = shape.totalArea();
  return Math.abs(rawArea / multiplier) / multiplier;
}
