import { MediaType } from '@/types/media/media.type';

import axios from 'axios';

type Data = { links: string[] };

export const getImages = async (
  query: string,
  count: number,
  mediaType: MediaType
): Promise<Data> => {
  const { data } = await axios.get(
    `http://localhost:4000/api/parse/images/${mediaType}/${count}`,
    { params: { query } }
  );
  return data;
};
