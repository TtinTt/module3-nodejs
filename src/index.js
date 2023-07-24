// const express = require('express');
import express from "express"; // Phải thêm "type": "module" ở package.json
import bodyParser from "body-parser";
import morgan from "morgan";
import fs from "fs";

const application = express();

// Cấu hình body parser
// parse application/x-www-form-urlencoded
application.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
application.use(bodyParser.json());

// Cấu hình morgan
const accessLogStream = fs.createWriteStream("src/logs/access.log", {
  flags: "a",
});
application.use(morgan("combined", { stream: accessLogStream }));

const getNextId = (items) => {
  // Trường hợp 1: nếu items rỗng thì next ID sẽ là 1
  if (items.length === 0) {
    return 1;
  }
  // Trường hợp 2: Nếu items không rỗng thì next ID sẽ bằng ID lớn nhất trong danh sách items + 1
  else {
    // Lấy tất cả ID trong danh sách items lưu vào mảng idList
    const idList = items.map((todo) => {
      return todo.id;
    });

    // Lấy giá trị ID lớn nhất trong mảng idList
    const maxId = Math.max(...idList);

    // Trả về next ID: ID lớn nhất trong danh sách items + 1
    return maxId + 1;
  }
};

let users = [];

// Search user
application.get("/users", (req, res) => {
  const keyword = req.query.keyword;

  if (keyword !== undefined) {
    const searchUsers = users.filter((user) => {
      return (
        user.username.toLowerCase().includes(keyword.toLowerCase()) ||
        user.email.toLowerCase().includes(keyword.toLowerCase()) ||
        user.first_name.toLowerCase().includes(keyword.toLowerCase()) ||
        user.last_name.toLowerCase().includes(keyword.toLowerCase())
      );
    });
    res.send(searchUsers);
  } else {
    res.send(users);
  }
});

// Tạo user
application.post("/users", (req, res) => {
  users.push({
    ...req.body,
    id: getNextId(users),
    created_at: new Date(),
    updated_at: new Date(),
  });

  res
    .status(201) // HTTP status code 201: CREATED
    .send(req.body);
});

// Lấy thông tin 1 user
application.get("/users/:id", (req, res) => {
  const { id } = req.params;

  const user = users.find((user) => user.id == id);

  if (user) {
    res.send(user);
  } else {
    res.status(404).send({
      error: "User not found",
    });
  }
});

application.put("/users/:id", (req, res) => {
  const { id } = req.params;

  // Kiểm tra user với param id có tồn tại không
  const user = users.find((user) => user.id == id);

  // Nếu không tồn tại thì trả về lỗi
  if (!user) {
    res.status(404).send({
      error: "User not found",
    });
  }

  // Lấy request body
  const requestBody = req.body;
  let updatedUser = null;

  users = users.map((user) => {
    if (user.id == id) {
      updatedUser = {
        ...user,
        first_name: requestBody.first_name,
        last_name: requestBody.last_name,
        password: requestBody.password ? requestBody.password : user.password,
        role: requestBody.role,
        updated_at: new Date(),
      };
      return updatedUser;
    } else {
      return user;
    }
  });

  // Lấy lại user sau khi update
  // const userUpdated = users.find(user => user.id == id);
  res.send(updatedUser);
});

application.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  // Kiểm tra user với param id có tồn tại không
  const user = users.find((user) => user.id == id);

  // Nếu không tồn tại thì trả về lỗi
  if (!user) {
    res.status(404).send({
      error: "User not found",
    });
  }

  users = users.filter((user) => user.id != id);
  res.status(204).send(); // HTTP status code 204 (No Content) - thường được sử dụng để trả về sau khi xóa thành công
});

// PRODUCTS
let products = [];

// Search product
application.get("/products", (req, res) => {
  const keyword = req.query.keyword;

  if (keyword !== undefined) {
    const searchProducts = products.filter((product) => {
      return (
        product.productname.toLowerCase().includes(keyword.toLowerCase()) ||
        product.description.toLowerCase().includes(keyword.toLowerCase()) ||
        product.sku.toLowerCase().includes(keyword.toLowerCase()) ||
        product.tag.toLowerCase().includes(keyword.toLowerCase()) ||
        product.id.toLowerCase().includes(keyword.toLowerCase())
      );
    });
    res.send(searchProducts);
  } else {
    res.send(products);
  }
});

// Tạo product
application.post("/products", (req, res) => {
  products.push({
    ...req.body,
    id: getNextId(products),
    created_at: new Date(),
    updated_at: new Date(),
  });

  res
    .status(201) // HTTP status code 201: CREATED
    .send(req.body);
});

// Lấy thông tin 1 product
application.get("/products/:id", (req, res) => {
  const { id } = req.params;

  const product = products.find((product) => product.id == id);

  if (product) {
    res.send(product);
  } else {
    res.status(404).send({
      error: "Product not found",
    });
  }
});

application.put("/products/:id", (req, res) => {
  const { id } = req.params;

  // Kiểm tra product với param id có tồn tại không
  const product = products.find((product) => product.id == id);

  // Nếu không tồn tại thì trả về lỗi
  if (!product) {
    res.status(404).send({
      error: "Product not found",
    });
  }

  // Lấy request body
  const requestBody = req.body;
  let updatedProduct = null;

  products = products.map((product) => {
    if (product.id == id) {
      updatedProduct = {
        ...product,
        name: requestBody.name,
        description: requestBody.description,
        sku: requestBody.sku,
        tag: requestBody.tag,
        price: requestBody.price,
        updated_at: new Date(),
      };
      return updatedProduct;
    } else {
      return product;
    }
  });

  // Lấy lại product sau khi update
  // const productUpdated = products.find(product => product.id == id);
  res.send(updatedProduct);
});

application.delete("/products/:id", (req, res) => {
  const { id } = req.params;

  // Kiểm tra product với param id có tồn tại không
  const product = products.find((product) => product.id == id);

  // Nếu không tồn tại thì trả về lỗi
  if (!product) {
    res.status(404).send({
      error: "Product not found",
    });
  }

  products = products.filter((product) => product.id != id);
  res.status(204).send(); // HTTP status code 204 (No Content) - thường được sử dụng để trả về sau khi xóa thành công
});

// ORDERS

let orders = [];

// Search order
application.get("/orders", (req, res) => {
  const keyword = req.query.keyword;

  if (keyword !== undefined) {
    const searchorders = orders.filter((order) => {
      return (
        order.id.toLowerCase().includes(keyword.toLowerCase()) ||
        order.customer.toLowerCase().includes(keyword.toLowerCase())
      );
    });
    res.send(searchorders);
  } else {
    res.send(orders);
  }
});

// Tạo order
application.post("/orders", (req, res) => {
  orders.push({
    ...req.body,
    status: 0,
    id: getNextId(orders),
    created_at: new Date(),
    updated_at: new Date(),
  });

  res
    .status(201) // HTTP status code 201: CREATED
    .send(req.body);
});

// Lấy thông tin 1 order
application.get("/orders/:id", (req, res) => {
  const { id } = req.params;

  const order = orders.find((order) => order.id == id);

  if (order) {
    res.send(order);
  } else {
    res.status(404).send({
      error: "order not found",
    });
  }
});

application.put("/orders/:id", (req, res) => {
  const { id } = req.params;

  // Kiểm tra order với param id có tồn tại không
  const order = orders.find((order) => order.id == id);

  // Nếu không tồn tại thì trả về lỗi
  if (!order) {
    res.status(404).send({
      error: "order not found",
    });
  }

  // Lấy request body
  const requestBody = req.body;
  let updatedorder = null;

  orders = orders.map((order) => {
    if (order.id == id) {
      updatedorder = {
        ...order,
        status: requestBody.status,
        updated_at: new Date(),
      };
      return updatedorder;
    } else {
      return order;
    }
  });

  // Lấy lại order sau khi update
  // const orderUpdated = orders.find(order => order.id == id);
  res.send(updatedorder);
});

application.delete("/orders/:id", (req, res) => {
  const { id } = req.params;

  // Kiểm tra order với param id có tồn tại không
  const order = orders.find((order) => order.id == id);

  // Nếu không tồn tại thì trả về lỗi
  if (!order) {
    res.status(404).send({
      error: "order not found",
    });
  }

  orders = orders.filter((order) => order.id != id);
  res.status(204).send(); // HTTP status code 204 (No Content) - thường được sử dụng để trả về sau khi xóa thành công
});

// CONTACTS

let contacts = [];

// Search contact
application.get("/contacts", (req, res) => {
  const keyword = req.query.keyword;

  if (keyword !== undefined) {
    const searchcontacts = contacts.filter((contact) => {
      return (
        contact.id.toLowerCase().includes(keyword.toLowerCase()) ||
        contact.customer.toLowerCase().includes(keyword.toLowerCase())
      );
    });
    res.send(searchcontacts);
  } else {
    res.send(contacts);
  }
});

// Tạo contact
application.post("/contacts", (req, res) => {
  contacts.push({
    ...req.body,
    status: 0,
    id: getNextId(contacts),
    created_at: new Date(),
    updated_at: new Date(),
  });

  res
    .status(201) // HTTP status code 201: CREATED
    .send(req.body);
});

// Lấy thông tin 1 contact
application.get("/contacts/:id", (req, res) => {
  const { id } = req.params;

  const contact = contacts.find((contact) => contact.id == id);

  if (contact) {
    res.send(contact);
  } else {
    res.status(404).send({
      error: "contact not found",
    });
  }
});

application.put("/contacts/:id", (req, res) => {
  const { id } = req.params;

  // Kiểm tra contact với param id có tồn tại không
  const contact = contacts.find((contact) => contact.id == id);

  // Nếu không tồn tại thì trả về lỗi
  if (!contact) {
    res.status(404).send({
      error: "contact not found",
    });
  }

  // Lấy request body
  const requestBody = req.body;
  let updatedcontact = null;

  contacts = contacts.map((contact) => {
    if (contact.id == id) {
      updatedcontact = {
        ...contact,
        status: requestBody.status,
        updated_at: new Date(),
      };
      return updatedcontact;
    } else {
      return contact;
    }
  });

  // Lấy lại contact sau khi update
  // const contactUpdated = contacts.find(contact => contact.id == id);
  res.send(updatedcontact);
});

application.delete("/contacts/:id", (req, res) => {
  const { id } = req.params;

  // Kiểm tra contact với param id có tồn tại không
  const contact = contacts.find((contact) => contact.id == id);

  // Nếu không tồn tại thì trả về lỗi
  if (!contact) {
    res.status(404).send({
      error: "contact not found",
    });
  }

  contacts = contacts.filter((contact) => contact.id != id);
  res.status(204).send(); // HTTP status code 204 (No Content) - thường được sử dụng để trả về sau khi xóa thành công
});

application.listen(8000, () => {
  console.log("Server started");
});
