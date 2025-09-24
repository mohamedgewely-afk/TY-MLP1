export const placeholderImage = (w = 1600, h = 900, text = "Toyota Land Cruiser") =>
  `https://via.placeholder.com/${w}x${h}.png?text=${encodeURIComponent(text)}`;

export const loadMedia = async (src?: string) => {
  if (!src) return;
  const img = new Image();
  img.src = src;
  await img.decode().catch(() => {});
  return;
};