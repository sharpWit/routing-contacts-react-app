import {
  Form,
  useLoaderData,
  redirect,
  useNavigate,
  ActionFunctionArgs,
  ActionFunction,
} from "react-router-dom";
import { updateContact } from "../utils/apiRequests";
import { TLoaderContact, TParams } from "../types/requests";

// ACTION
export const action: ActionFunction<TParams> = async ({
  request,
  params,
}: ActionFunctionArgs<TParams>): Promise<Response> => {
  if (!request.formData) {
    // Handle the case when formData is undefined
    throw new Error("FormData is not available.");
  }

  const formData = await request.formData();

  // Convert FormData to a plain JavaScript object
  const updates: Record<string, string> = {};
  formData.forEach((value, key) => {
    updates[key] = value as string;
  });

  if (params.contactId === undefined) {
    throw new Error("Contact ID is undefined");
  }

  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
};

export default function EditContact() {
  const { contact } = useLoaderData() as TLoaderContact;
  const navigate = useNavigate();

  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact.first}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea name="notes" defaultValue={contact.notes} rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </button>
      </p>
    </Form>
  );
}
