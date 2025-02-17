export function logTime(label: string, startTime: number) {
  const duration = Date.now() - startTime;
  let color = "";

  if (duration < 250) {
    color += "32m"; // green
  } else if (duration <= 500) {
    color += "33m"; // yellow
  } else {
    color += "31m"; // red
  }

  console.debug(`${label} \x1b[${color}${duration} ms\x1b[0m`);
}
