import sharp from "sharp";

const inputPath = process.argv[2] ?? "public/og-image-v3.png";
const outputPath = process.argv[3] ?? "public/og-image-white-tile-v4.png";

const targetOrange = [235, 103, 43];
const targetWhite = [255, 255, 255];
const targetBlue = [57, 139, 208];

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function sourceWeights(red, green, blue) {
  const markWeight = smoothstep(8, 105, blue - red);
  const whiteness = Math.min(red, green, blue);
  const textWeight = smoothstep(74, 235, whiteness) * (1 - markWeight);
  const backgroundWeight = Math.max(0, 1 - textWeight - markWeight);
  return [backgroundWeight, textWeight, markWeight];
}

function roundedTileAlpha(x, y, width, height) {
  const radius = Math.round(width * 0.225);
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const qx = Math.abs(x + 0.5 - halfWidth) - (halfWidth - radius);
  const qy = Math.abs(y + 0.5 - halfHeight) - (halfHeight - radius);
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
  const inside = Math.min(Math.max(qx, qy), 0);
  const signedDistance = outside + inside - radius;
  return Math.round(clamp(0.5 - signedDistance) * 255);
}

const { data, info } = await sharp(inputPath)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const output = Buffer.alloc(info.width * info.height * 4);

for (let y = 0; y < info.height; y += 1) {
  for (let x = 0; x < info.width; x += 1) {
    const sourceIndex = (y * info.width + x) * 3;
    const outputIndex = (y * info.width + x) * 4;
    const [backgroundWeight, textWeight, markWeight] = sourceWeights(
      data[sourceIndex],
      data[sourceIndex + 1],
      data[sourceIndex + 2],
    );

    for (let channel = 0; channel < 3; channel += 1) {
      output[outputIndex + channel] = Math.round(
        backgroundWeight * targetWhite[channel]
        + textWeight * targetOrange[channel]
        + markWeight * targetBlue[channel],
      );
    }
    output[outputIndex + 3] = roundedTileAlpha(x, y, info.width, info.height);
  }
}

await sharp(output, {
  raw: {
    width: info.width,
    height: info.height,
    channels: 4,
  },
})
  .png({ compressionLevel: 9 })
  .toFile(outputPath);

console.log(`Rendered ${outputPath} from ${inputPath}`);
