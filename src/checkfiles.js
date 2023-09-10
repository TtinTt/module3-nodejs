import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const emailLogin = "envious.03859@yahoo.com"; // Điền email Yahoo của bạn
  const urlInput = "https://login.yahoo.com/"; // URL của trang Yahoo Mail

  try {
    // Truy cập trang đăng nhập Yahoo Mail
    await page.goto(urlInput);

    // Điền thông tin đăng nhập và bấm nút Đăng nhập
    await page.type("#login-username", emailLogin); // Thay đổi selector cho trường email
    await page.click("#login-signin"); // Thay đổi selector cho nút Đăng nhập
    await page.waitForTimeout(2000); // Chờ một lát cho trang tiếp theo hiển thị
    await page.type("#login-passwd", "Oanh@217"); // Điền mật khẩu của bạn
    await page.click("#login-signin"); // Thay đổi selector cho nút Đăng nhập (nếu cần)

    // Đợi để đảm bảo bạn đã đăng nhập thành công hoặc xử lý dựa trên trang sau khi đăng nhập
    await page.waitForNavigation();

    await page.goto("https://mail.yahoo.com/d/folders/26");
    await page.waitForTimeout(2000); // Chờ một lát cho trang tiếp theo hiển thị

    // Selector cho thư trong hộp thư đến
    const emailSelector = ".D_F .BltHke.nH.oy8Mbf"; // Thay đổi selector tùy theo giao diện Yahoo Mail của bạn

    // Sử dụng page.$$eval để trích xuất địa chỉ email
    const emailAddresses = await page.$$eval(emailSelector, (emails) => {
      return emails.map((email) => email.textContent);
    });

    console.log("Địa chỉ email trong hộp thư đến:");
    console.log(emailAddresses);

    // Lưu dữ liệu vào tệp JSON
    const uniqueEmails = Array.from(new Set(emailAddresses)); // Loại bỏ bất kỳ email trùng lặp nào

    const emailData = {
      emailLogin: emailLogin,
      emails: uniqueEmails,
    };

    const jsonData = JSON.stringify(emailData, null, 2);
    fs.writeFileSync(`${emailLogin}.json`, jsonData);

    console.log(`Dữ liệu đã được lưu vào file ${emailLogin}.json`);
  } catch (error) {
    console.error("Xảy ra lỗi:", error);
  } finally {
    // Đóng trình duyệt sau khi hoàn thành công việc
    await browser.close();
  }
})();
