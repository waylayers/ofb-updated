export default function waitRandomDelay(time: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), time + Math.random() * 1000 - 500);
  });
}
