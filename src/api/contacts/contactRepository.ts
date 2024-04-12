import { Contact, ContactEntity } from '@/api/contacts/contactModel';

type NullablePartial<T> = {
  [P in keyof T]?: T[P] | null | undefined;
};

const mapDocumentToContact = (document: NullablePartial<Contact> & { _id: { toString: () => string } }) => {
  return {
    id: document._id.toString()!,
    email: document.email!,
    firstname: document.firstname!,
    lastname: document.lastname!,
  };
};

export const contactRepository = {
  findAll: async (): Promise<Contact[]> => {
    const result = await ContactEntity.find();

    return result.map(mapDocumentToContact);
  },

  findById: async (id: string): Promise<Contact | null> => {
    const result = await ContactEntity.findOne({ _id: id });

    if (!result) {
      return null;
    }

    return mapDocumentToContact(result);
  },

  create: async (params: Omit<Contact, 'id'>): Promise<Contact> => {
    const result = await ContactEntity.create(params);

    return mapDocumentToContact(result);
  },

  updateById: async (params: Contact): Promise<Contact | null> => {
    const { id, ...set } = params;
    const result = await ContactEntity.findOneAndUpdate({ _id: id }, { $set: set }, { new: true });

    if (!result) {
      return null;
    }

    return mapDocumentToContact(result);
  },

  deleteById: async (id: string): Promise<void> => {
    await ContactEntity.deleteOne({ _id: id });
  },

  checkIfExistsByEmail: async (email: string): Promise<boolean> => {
    const result = await ContactEntity.countDocuments({ email });

    return Boolean(result);
  },

  checkIfExistsById: async (id: string): Promise<boolean> => {
    const result = await ContactEntity.countDocuments({ _id: id });

    return Boolean(result);
  },
};
