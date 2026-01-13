export default function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const key in intervals) {
    const value = intervals[key];
    const count = Math.floor(seconds / value);

    if (count >= 1) {
      return `${count} ${key}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
}
