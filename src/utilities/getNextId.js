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
export default getNextId;
