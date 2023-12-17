import { TContact } from "./contacts";

export type TLoaderRequest = {
  contacts: TContact[];
  q: string;
};

export type TParams = {
  contactId: string;
};

export type TLoaderContact = {
  contact: TContact;
};

export type TLoaderContacts = {
  contacts: TContact[];
  q: string;
};
