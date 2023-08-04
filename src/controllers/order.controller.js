import getNextId from "../utilities/getNextId.js";

let orders = [
  {
    id: 1,
    ordername: "thailq",
    email: "thailq@mail.com",
  },
  {
    id: 2,
    ordername: "giangnt",
    email: "giangnt@mail.com",
  },
];

// Trả về trang HTML hiển thị danh sách orders
const searchOrders = (req, res) => {
  res.render("pages/orders/index", {
    title: "Danh sách người dùng",
    orders: orders,
  });
};

// Trả về HTML - form thêm mới order
const viewAddOrder = (req, res) => {
  res.render("pages/orders/new");
};

// Thực thi add order: nhận request từ form thêm mới order
const addOrder = (req, res) => {
  const input = req.body;

  const newOrder = {
    ...input,
    id: getNextId(orders),
  };

  orders.push(newOrder);

  // Chuyển hướng về trang danh sách
  res.redirect("/orders");
};

// Trả về HTML - thông tin order
const getDetailOrder = (req, res) => {};

// Trả về HTML form cập nhật order
const viewEditOrder = (req, res) => {
  const { id } = req.params;

  const order = orders.find((order) => order.id == id);

  if (order) {
    res.render("pages/orders/edit", {
      order: order,
    });
  } else {
    res.render("errors/404", {
      msg: "Người dùng không tồn tại",
    });
  }
};

// Thực thi cập nhật order
const updateOrder = (req, res) => {
  const { id } = req.params;

  const input = req.body;

  orders = orders.map((order) => {
    if (order.id == id) {
      return {
        ...order,
        ordername: input.ordername,
        email: input.email,
      };
    } else {
      return order;
    }
  });

  // Chuyển hướng về trang danh sách
  res.redirect("/orders");
};

// Thực thi xóa order
const deleteOrder = (req, res) => {
  const { id } = req.params;

  const order = orders.find((order) => order.id == id);

  if (order) {
    orders = orders.filter((order) => order.id != id);

    // Chuyển hướng về trang danh sách
    res.redirect("/orders");
  } else {
    res.render("errors/404", {
      msg: "Người dùng không tồn tại",
    });
  }
};

export default {
  searchOrders,
  viewAddOrder,
  addOrder,
  getDetailOrder,
  viewEditOrder,
  updateOrder,
  deleteOrder,
};
