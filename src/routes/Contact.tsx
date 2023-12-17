import { FC } from "react";
import {
  Form,
  useLoaderData,
  useFetcher,
  LoaderFunction,
  LoaderFunctionArgs,
  ActionFunction,
  ActionFunctionArgs,
} from "react-router-dom";

import { getContact, updateContact } from "../utils/apiRequests";
import { TContact } from "../types/contacts";
import { TLoaderContact, TParams } from "../types/requests";

// LOADER
export const loader: LoaderFunction<TParams> = async ({
  params,
}: LoaderFunctionArgs<TParams>): Promise<TLoaderContact> => {
  if (params.contactId === undefined) {
    throw new Error("Contact ID is undefined");
  }
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return { contact };
};

// ACTION
export const action: ActionFunction<TParams> = async ({
  request,
  params,
}: ActionFunctionArgs<TParams>): Promise<TContact | undefined> => {
  if (!request.formData) {
    // Handle the case when formData is undefined
    throw new Error("FormData is not available.");
  }

  const formData = await request.formData();

  if (params.contactId === undefined) {
    throw new Error("Contact ID is undefined");
  }
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
    // Add other fields as needed
  });
};

const Contact = () => {
  const { contact } = useLoaderData() as TLoaderContact;

  return (
    <div id="contact">
      <div>
        <img key={contact.avatar} src={contact.avatar || ""} />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
};

interface Props {
  contact: TContact;
}
const Favorite: FC<Props> = ({ contact }) => {
  const fetcher = useFetcher();
  let favorite = contact.favorite;

  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
};

export default Contact;
