export function readableDate(s: string) {
  return new Date(Date.parse(s)).toDateString();
}

export const getQueryParams = () => {
  return Object.fromEntries(new URLSearchParams(window.location.search));
};
