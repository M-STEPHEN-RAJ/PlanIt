export default function getCroppedImg(imageSrc, pixelCrop) {
  const canvas = document.createElement("canvas");
  const img = new Image();
  img.src = imageSrc;

  return new Promise((resolve) => {
    img.onload = () => {
      const MAX_SIZE = 500;
      const scale = Math.min(MAX_SIZE / pixelCrop.width, MAX_SIZE / pixelCrop.height, 1);

      canvas.width = pixelCrop.width * scale;
      canvas.height = pixelCrop.height * scale;

      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Circular mask
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(
        img,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob(
        (blob) => resolve(blob),
        "image/jpeg",
        0.8
      );
    };
  });
}
