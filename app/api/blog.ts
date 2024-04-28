import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://api.hashnode.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "60d1ff82f0eac86cc6b00d66",
    },
    body: JSON.stringify({
      query:
        'query {user(username: "testchan") {publication {posts(page: 0) {title brief slug coverImage dateAdded}}}}',
    }),
  });
  const publications = await res.json();

  if (!publications) {
    return {
      notFound: true,
    };
  }

  return NextResponse.json(publications);
}
