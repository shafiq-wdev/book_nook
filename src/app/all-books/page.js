import { redirect } from "next/navigation";

export const metadata = {
  title: "All Books",
};

export default function AllBooksRedirectPage() {
  redirect("/books");
}