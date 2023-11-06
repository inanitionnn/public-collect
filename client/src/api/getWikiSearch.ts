import { MediaType } from '@/types/media/media.type';
import axios from 'axios';
type Data = {
  link: 'string';
  image?: 'string';
  title: 'string';
  description?: 'string';
}[];

export const getWikiSearch = async (
  query: string,
  mediaType: MediaType,
  count: number
): Promise<Data> => {
  const { data } = await axios.get(
    `http://localhost:4000/api/parse/wiki/search/${mediaType}/${count}`,
    { params: { query } }
  );
  return data;
};
