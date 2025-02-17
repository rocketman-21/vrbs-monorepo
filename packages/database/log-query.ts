export function logQuery(event: { query: string; duration: number; params: any; db: string }) {
  if (event.duration < 50) return;
  console.debug(`${`${event.db} DB`} ${formatLogQuery(event.query)}`, `${event.duration} ms`);
}

function formatLogQuery(log: string) {
  return replaceProjectWithCount(replaceRemove(log));
}

function replaceProjectWithCount(log: string): string {
  const regex = /\$project: ({.*})/;
  const match = log.match(regex);
  if (!match) return log;

  const fieldsCount = match[1].match(/:/g)?.length ?? 0;
  if (fieldsCount <= 1) return log;
  return log.replace(match[1], `${fieldsCount} fields`);
}

function replaceRemove(log: string): string {
  const regex = /{ \$ne:[^\]]*"\$\$REMOVE", \], }/gi;
  return log.replace(regex, "");
}
