import getNextId from "../utilities/getNextId.js";
import todoList from "./todos.js";
// [
//   {
//     id: 1,
//     title: "thailq",
//     email: "thailq@mail.com",
//   },
//   {
//     id: 2,
//     title: "giangnt",
//     email: "giangnt@mail.com",
//   }
// {
//   userId: 1,
//   id: 1,
//   title: "delectus aut autem",
//   completed: false,
// }
//]

let todos = todoList;

// Trả về trang HTML hiển thị danh sách todos
const searchTodos = (req, res) => {
  res.render("pages/todos/index", {
    title: "Danh sách việc cần làm",
    todos: todos,
  });
};

// Trả về HTML - form thêm mới todo
const viewAddTodo = (req, res) => {
  res.render("pages/todos/new");
};

// Thực thi add todo: nhận request từ form thêm mới todo
const addTodo = (req, res) => {
  const input = req.body;

  const isDuplicate = todos.find((todo) => todo.title == input.title);

  if (!isDuplicate) {
    const newTodo = {
      ...input,
      id: getNextId(todos),
      completed: false,
    };
    // todos = [newTodo, ...todos];
    todos.push(newTodo);

    // Chuyển hướng về trang danh sách
    res.redirect("/todos");
  } else {
    res.render("errors/404", {
      msg: "Công việc đã tồn tại",
    });
  }
};

// Trả về HTML - thông tin todo
const getDetailTodo = (req, res) => {
  const { id } = req.params;

  const todoById = todos.filter((todo) => {
    return todo.userId == id;
  });

  if (todoById.length != 0) {
    res.render("pages/todos/index", {
      title: "Danh sách việc cần làm của người dùng " + id,
      todos: todoById,
    });
  } else {
    res.render("errors/404", {
      msg: "Người dùng không tồn tại",
    });
  }
};

// Trả về HTML form cập nhật todo
const viewEditTodo = (req, res) => {
  const { id } = req.params;

  const todo = todos.find((todo) => todo.id == id);

  if (todo) {
    res.render("pages/todos/edit", {
      todo: todo,
    });
  } else {
    res.render("errors/404", {
      msg: "Người dùng không tồn tại",
    });
  }
};

// Thực thi cập nhật todo
const updateTodo = (req, res) => {
  const { id } = req.params;

  const input = req.body;
  if ((input.completed != "true") & (input.completed != "false")) {
    res.render("errors/404", {
      msg: "trạng thái công việc chỉ có thể là true hoặc false",
    });
  }
  todos = todos.map((todo) => {
    if (todo.id == id) {
      return {
        ...todo,
        title: input.title,
        email: input.email,
        completed: input.completed,
      };
    } else {
      return todo;
    }
  });

  // Chuyển hướng về trang danh sách
  res.redirect("/todos");
};

// Thực thi xóa todo
const deleteTodo = (req, res) => {
  const { id } = req.params;

  const todo = todos.find((todo) => todo.id == id);

  if (todo) {
    todos = todos.filter((todo) => todo.id != id);

    // Chuyển hướng về trang danh sách
    res.redirect("/todos");
  } else {
    res.render("errors/404", {
      msg: "Người dùng không tồn tại",
    });
  }
};

// Thực thi cập nhật trạng thái
const completeTodo = (req, res) => {
  const { id } = req.params;
  todos = todos.map((todo) => {
    if (todo.id == id) {
      return {
        ...todo,
        completed: todo.completed == false ? true : false,
      };
    } else {
      return todo;
    }
  });

  // Chuyển hướng về trang danh sách
  res.redirect("/todos");
};

export default {
  completeTodo,
  searchTodos,
  viewAddTodo,
  addTodo,
  getDetailTodo,
  viewEditTodo,
  updateTodo,
  deleteTodo,
};
