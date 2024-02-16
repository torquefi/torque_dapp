export function arrayURLFetcher(urlArr: any) {
  const fetcher = (url: any) => fetch(url).then((res) => res.json());
  return Promise.all(urlArr.map(fetcher));
}

export function jsonFetcher(url: any) {
  // @ts-ignore
  return fetch(url).then((res) => res.json());
}
