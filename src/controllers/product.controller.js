import getNextId from "../utilities/getNextId.js";

let products = [
  {
    id: 1,
    productname: "thailq",
    email: "thailq@mail.com",
  },
  {
    id: 2,
    productname: "giangnt",
    email: "giangnt@mail.com",
  },
];

// Trả về trang HTML hiển thị danh sách products
const searchProducts = (req, res) => {
  res.render("pages/products/index", {
    title: "Danh sách người dùng",
    products: products,
  });
};

// Trả về HTML - form thêm mới product
const viewAddProduct = (req, res) => {
  res.render("pages/products/new");
};

// Thực thi add product: nhận request từ form thêm mới product
const addProduct = (req, res) => {
  const input = req.body;

  const newProduct = {
    ...input,
    id: getNextId(products),
  };

  products.push(newProduct);

  // Chuyển hướng về trang danh sách
  res.redirect("/products");
};

// Trả về HTML - thông tin product
const getDetailProduct = (req, res) => {};

// Trả về HTML form cập nhật product
const viewEditProduct = (req, res) => {
  const { id } = req.params;

  const product = products.find((product) => product.id == id);

  if (product) {
    res.render("pages/products/edit", {
      product: product,
    });
  } else {
    res.render("errors/404", {
      msg: "Người dùng không tồn tại",
    });
  }
};

// Thực thi cập nhật product
const updateProduct = (req, res) => {
  const { id } = req.params;

  const input = req.body;

  products = products.map((product) => {
    if (product.id == id) {
      return {
        ...product,
        productname: input.productname,
        email: input.email,
      };
    } else {
      return product;
    }
  });

  // Chuyển hướng về trang danh sách
  res.redirect("/products");
};

// Thực thi xóa product
const deleteProduct = (req, res) => {
  const { id } = req.params;

  const product = products.find((product) => product.id == id);

  if (product) {
    products = products.filter((product) => product.id != id);

    // Chuyển hướng về trang danh sách
    res.redirect("/products");
  } else {
    res.render("errors/404", {
      msg: "Người dùng không tồn tại",
    });
  }
};

export default {
  searchProducts,
  viewAddProduct,
  addProduct,
  getDetailProduct,
  viewEditProduct,
  updateProduct,
  deleteProduct,
};
