import { ActionFunction, ActionFunctionArgs, redirect } from "react-router-dom";
import { deleteContact } from "../utils/apiRequests";
import { TParams } from "../types/requests";

export const action: ActionFunction<TParams> = async ({
  params,
}: ActionFunctionArgs<TParams>): Promise<Response> => {
  if (params.contactId === undefined) {
    throw new Error("Contact ID is undefined");
  }
  await deleteContact(params.contactId);
  return redirect("/");
};
