import getNextId from "../utilities/getNextId.js";

let contacts = [
  {
    id: 1,
    contactname: "thailq",
    email: "thailq@mail.com",
  },
  {
    id: 2,
    contactname: "giangnt",
    email: "giangnt@mail.com",
  },
];

// Trả về trang HTML hiển thị danh sách contacts
const searchContacts = (req, res) => {
  res.render("pages/contacts/index", {
    title: "Danh sách người dùng",
    contacts: contacts,
  });
};

// Trả về HTML - form thêm mới contact
const viewAddContact = (req, res) => {
  res.render("pages/contacts/new");
};

// Thực thi add contact: nhận request từ form thêm mới contact
const addContact = (req, res) => {
  const input = req.body;

  const newContact = {
    ...input,
    id: getNextId(contacts),
  };

  contacts.push(newContact);

  // Chuyển hướng về trang danh sách
  res.redirect("/contacts");
};

// Trả về HTML - thông tin contact
const getDetailContact = (req, res) => {};

// Trả về HTML form cập nhật contact
const viewEditContact = (req, res) => {
  const { id } = req.params;

  const contact = contacts.find((contact) => contact.id == id);

  if (contact) {
    res.render("pages/contacts/edit", {
      contact: contact,
    });
  } else {
    res.render("errors/404", {
      msg: "Người dùng không tồn tại",
    });
  }
};

// Thực thi cập nhật contact
const updateContact = (req, res) => {
  const { id } = req.params;

  const input = req.body;

  contacts = contacts.map((contact) => {
    if (contact.id == id) {
      return {
        ...contact,
        contactname: input.contactname,
        email: input.email,
      };
    } else {
      return contact;
    }
  });

  // Chuyển hướng về trang danh sách
  res.redirect("/contacts");
};

// Thực thi xóa contact
const deleteContact = (req, res) => {
  const { id } = req.params;

  const contact = contacts.find((contact) => contact.id == id);

  if (contact) {
    contacts = contacts.filter((contact) => contact.id != id);

    // Chuyển hướng về trang danh sách
    res.redirect("/contacts");
  } else {
    res.render("errors/404", {
      msg: "Người dùng không tồn tại",
    });
  }
};

export default {
  searchContacts,
  viewAddContact,
  addContact,
  getDetailContact,
  viewEditContact,
  updateContact,
  deleteContact,
};
