import getNextId from "../utilities/getNextId.js";

let users = [
  {
    id: 1,
    username: "thailq",
    email: "thailq@mail.com",
  },
  {
    id: 2,
    username: "giangnt",
    email: "giangnt@mail.com",
  },
];

// Trả về trang HTML hiển thị danh sách users
const searchUsers = (req, res) => {
  res.render("pages/users/index", {
    title: "Danh sách người dùng",
    users: users,
  });
};

// Trả về HTML - form thêm mới user
const viewAddUser = (req, res) => {
  res.render("pages/users/new");
};

// Thực thi add user: nhận request từ form thêm mới user
const addUser = (req, res) => {
  const input = req.body;

  const newUser = {
    ...input,
    id: getNextId(users),
  };

  users.push(newUser);

  // Chuyển hướng về trang danh sách
  res.redirect("/users");
};

// Trả về HTML - thông tin user
const getDetailUser = (req, res) => {};

// Trả về HTML form cập nhật user
const viewEditUser = (req, res) => {
  const { id } = req.params;

  const user = users.find((user) => user.id == id);

  if (user) {
    res.render("pages/users/edit", {
      user: user,
    });
  } else {
    res.render("errors/404", {
      msg: "Người dùng không tồn tại",
    });
  }
};

// Thực thi cập nhật user
const updateUser = (req, res) => {
  const { id } = req.params;

  const input = req.body;

  users = users.map((user) => {
    if (user.id == id) {
      return {
        ...user,
        username: input.username,
        email: input.email,
      };
    } else {
      return user;
    }
  });

  // Chuyển hướng về trang danh sách
  res.redirect("/users");
};

// Thực thi xóa user
const deleteUser = (req, res) => {
  const { id } = req.params;

  const user = users.find((user) => user.id == id);

  if (user) {
    users = users.filter((user) => user.id != id);

    // Chuyển hướng về trang danh sách
    res.redirect("/users");
  } else {
    res.render("errors/404", {
      msg: "Người dùng không tồn tại",
    });
  }
};

export default {
  searchUsers,
  viewAddUser,
  addUser,
  getDetailUser,
  viewEditUser,
  updateUser,
  deleteUser,
};
