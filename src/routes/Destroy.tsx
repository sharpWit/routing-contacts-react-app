import { redirect } from "react-router-dom";
import { deleteContact } from "../constants/contacts";

// ACTION
export async function action({ params }) {
  await deleteContact(params.contactId);
  return redirect("/");
}
