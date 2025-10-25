export function formatDate(
  dateString: string,
  includeRelative: boolean,
): string {
  const now = new Date();
  if (!dateString.includes("T")) {
    dateString = `${dateString}T00:00:00`;
  }
  const targetDate = new Date(dateString);

  const yearsAgo = now.getFullYear() - targetDate.getFullYear();
  const monthsAgo = now.getMonth() - targetDate.getMonth();
  const daysAgo = now.getDate() - targetDate.getDate();

  let textAgo = "";
  if (yearsAgo > 0) {
    textAgo = yearsAgo === 1 ? "1 year ago" : `${yearsAgo} years ago`;
  } else if (monthsAgo > 0) {
    textAgo = monthsAgo === 1 ? "1 month ago" : `${monthsAgo} months ago`;
  } else if (daysAgo > 0) {
    textAgo = daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`;
  } else {
    textAgo = "today";
  }

  const fullDate = targetDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return includeRelative && textAgo ? `${fullDate} (${textAgo})` : fullDate;
}
