const fs = require("fs");

// Các định dạng file thường sử dụng:
// 1) .CSV
// 2) .TSV
// 3) .dat
// 4) .xls, .xlsx (Excel)
// 5) .zip / .rar / .7z / .gzip (Nén)
// 6) .png / .jpg / .gif / .mp4 / .mp3 (Media)

// Ghi file đồng bộ
// const content = 'Đây là nội dung file test.txt';
// fs.writeFileSync('test.txt', content);

// console.log("Phía dưới xử lý ghi file");

// Đọc file đồng bộ
// const data = fs.readFileSync('test.txt', 'utf-8');
// console.log('data', data);

// Xóa file
// fs.unlink('test.txt', (error) => {
//     if (error) {
//         console.log('error', error.message)
//     } else {
//         console.log('Xóa file thành công')
//     }
// });

// Ghi file bất đồng bộ
// const content2 = 'Đây là nội dung file test2.txt';
// fs.writeFile('test2.txt', content2, 'utf8', (error) => {
//     if (error) {
//         console.log('Error: ', error.message)
//     } else {
//         console.log('Ghi file thành công')
//     }
// });
// // trả kết quả
// console.log('Phía dưới hàm writeFile()');

// Đọc file bất đồng bộ
// fs.readFile('test2.txt', 'utf-8', (error, data) => {
//     if (error) {
//         console.log('Error: ', error.message);
//     } else {
//         console.log('Data: ', data)
//     }
// });

// console.log('Phía dưới hàm readFile()');

// fs.chmod('index2.js', 0o444, (error) => {
//     if (error) {
//         console.log("error: ", error.message)
//     }
// });

// Ghi file bất đồng bộ
const listMember = ["Thái", "Trung", "Sáng", "Huy", "Tài", "Giang", "Tín"];
let memberList = "";
listMember.forEach((member) => {
  memberList += member + "\n";
});
console.log(memberList);
fs.writeFile("listMemberClass.txt", memberList, "utf8", (error) => {
  if (error) {
    console.log("Error: ", error.message);
  } else {
    console.log("Ghi file thành công");
  }
});

// Ghi file bất đồng bộ
const listMemberInfo = [
  { name: "Thái", age: "21", homeTown: "Quảng Nam" },
  { name: "Trung", age: "22", homeTown: "Quảng Bình" },
  { name: "Sáng", age: "23", homeTown: "Hà Tĩnh" },
  { name: "Huy", age: "24", homeTown: "Đà Nẵng" },
  { name: "Tài", age: "25", homeTown: "Quảng Nam" },
  { name: "Giang", age: "26", homeTown: "Quảng Bình" },
  { name: "Tín", age: "18", homeTown: "Quang Nam" },
];

let info = "";
let filename = "";

listMemberInfo.map(
  (member) => (
    (filename = member.name + ".txt"),
    (info =
      "Tên: " +
      member.name +
      "\n" +
      "Tuổi: " +
      member.age +
      "\n" +
      "Quê quán: " +
      member.homeTown),
    fs.writeFile(filename, info, "utf8", (error) => {
      if (error) {
        console.log("Error: ", error.message);
      } else {
        console.log("Ghi file thành công");
      }
    })
  )
);

listMemberInfo.map((member) => {
  const filename2 = member.name + ".txt";
  // Đọc file bất đồng bộ
  fs.readFile(filename2, "utf-8", (error, data) => {
    if (error) {
      console.log("Error: ", error.message);
    } else {
      console.log(
        "----" + "\n" + ">Đây là nội dung của " + filename2 + " :" + +"\n",
        data
      );
    }
  });
});
