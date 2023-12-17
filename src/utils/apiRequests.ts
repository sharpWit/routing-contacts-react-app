import axios from "axios";
import sortBy from "sort-by";
import { v4 as uuidv4 } from "uuid";
import { matchSorter } from "match-sorter";

import { TContact, TCreateContact } from "../types/contacts";

const baseURL = "http://localhost:3001";

const axiosRequest = axios.create({
  baseURL: baseURL,
  timeout: 4000,
  headers: {
    Accept: "application/json",
  },
});

export const getContacts = async (query?: string): Promise<TContact[]> => {
  try {
    const params = query ? { params: { query } } : {};
    const res = await axiosRequest.get("/api/data/", params);

    if (res.status !== 200) {
      throw new Error("Invalid URL!");
    }

    let contacts: TContact[] = [];

    if (Array.isArray(res.data)) {
      contacts = res.data;
    } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
      contacts = res.data.data;
    } else {
      throw new Error("Unable to determine the structure of the data");
    }

    contacts.sort(sortBy("last", "createdAt"));

    if (query) {
      contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
    }

    console.log(contacts);
    return contacts;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(`Error: ${error}`);
    }

    // Ensure the function returns a Promise even in case of an error
    throw error;
  }
};

export const createContact = async (
  contact?: TCreateContact
): Promise<TContact> => {
  try {
    const id = uuidv4(); // Use uuidv4 to generate a random UUID
    const createContact = { ...contact, id, createdAt: Date.now() };
    const contacts = await getContacts();

    if (!contacts.some((c) => c.id === id)) {
      contacts.unshift(createContact);
      await axiosRequest.post(`/api/data/${id}`, createContact);
    } else {
      console.log("Contact with the same id already exists.");
    }

    return createContact;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(`Error: ${error}`);
    }

    // Ensure the function returns a Promise even in case of an error
    throw error;
  }
};

export const getContact = async (id: string): Promise<TContact | undefined> => {
  try {
    const contacts = await getContacts();
    return contacts.find((contact) => contact.id === id);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(`Error: ${error}`);
    }

    // Ensure the function returns a Promise even in case of an error
    throw error;
  }
};

export const updateContact = async (
  id: string,
  updates: Partial<TContact>
): Promise<TContact | undefined> => {
  try {
    const contacts = await getContacts();
    const contactIndex = contacts.findIndex((contact) => contact.id === id);

    if (contactIndex !== -1) {
      const updatedContact = { ...contacts[contactIndex], ...updates };
      contacts[contactIndex] = updatedContact;

      // Update the contact on the server
      await axiosRequest.patch(`/api/data/${id}`, updatedContact);

      return updatedContact;
    } else {
      console.log("Contact not found.");
      return undefined;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(`Error: ${error}`);
    }

    // Ensure the function returns a Promise even in case of an error
    throw error;
  }
};

export const deleteContact = async (id: string): Promise<void> => {
  try {
    const contacts = await getContacts();
    const contactIndex = contacts.findIndex((contact) => contact.id === id);

    if (contactIndex !== -1) {
      // Remove the contact from the array
      contacts.splice(contactIndex, 1);

      // Delete the contact on the server
      await axiosRequest.delete(`/api/data/${id}`);
    } else {
      console.log("Contact not found.");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(`Error: ${error}`);
    }

    // Ensure the function returns a Promise even in case of an error
    throw error;
  }
};
