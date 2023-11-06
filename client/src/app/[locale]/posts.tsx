"use client";

import { getCollection } from "@/api/getCollection";
import { useQuery } from "@tanstack/react-query";

export default function Posts() {
  const { data } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getCollection("film", 10, 0),
  });

  return (
    <>
      {data?.media.map((media: any) => (
        <div key={media.id}>{media.title}</div>
      ))}
    </>
  );
}
