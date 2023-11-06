import axios from 'axios';

type Data = {
  title: string;
  year: number;
};

export const getRemember = async (query: string): Promise<Data> => {
  const { data } = await axios.get(`http://localhost:4000/api/parse/title`, {
    params: { query },
  });
  return data;
};
