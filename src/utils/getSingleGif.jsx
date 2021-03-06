import { API_KEY, API_URL } from "./settings";

const fromApiResponse = (apiResponse) => {
  const { data } = apiResponse;
  const {
    id,
    title,
    images: {
      downsized_medium: { url },
    },
  } = data;

  const gif = { id, title, url };

  return gif;
};

export default function getSingleGif(id) {
  return fetch(`${API_URL}/gifs/${id}?api_key=${API_KEY}`)
    .then((res) => res.json())
    .then(fromApiResponse);
}
