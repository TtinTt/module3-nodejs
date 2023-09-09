import puppeteer from "puppeteer";
import getEmail from "./getmail.js";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const emailLogin = "info@burolino.de"; //TODO: EMAIL
  const urlInput =
    // "http://sellaccs247.com/roundcubemail-1.4.11/?_task=mail&_mbox=INBOX.case"; //TODO: URL

    "http://sellaccs247.com/roundcubemail-1.4.11/?_task=mail&_mbox=INBOX"; //TODO: URL

  try {
    // Truy cập trang đăng nhập
    await page.goto("http://sellaccs247.com/roundcubemail-1.4.11/");

    // Điền thông tin đăng nhập và bấm nút Đăng nhập
    await page.type("#rcmloginuser", emailLogin);
    await page.type("#rcmloginpwd", "Vanthe@123");
    await page.click("#rcmloginsubmit");

    // Đợi để đảm bảo bạn đã đăng nhập thành công hoặc xử lý dựa trên trang sau khi đăng nhập
    await page.waitForNavigation();

    const currentURL = await page.url();
    if (
      currentURL ===
      "http://sellaccs247.com/roundcubemail-1.4.11/?_task=mail&_mbox=INBOX"
    ) {
      console.log("Bạn đã đăng nhập thành công.");

      const startUID = 1;
      const endUID = 1706; // Thay đổi giá trị này theo nhu cầu của bạn
      // Sử dụng hàm getEmail và truyền trang đã đăng nhập
      await getEmail(startUID, endUID, emailLogin, urlInput, page);
    } else {
      console.log("Đăng nhập không thành công.");
    }
  } catch (error) {
    console.error("Xảy ra lỗi:", error);
  } finally {
    // Đóng trình duyệt sau khi hoàn thành công việc
    await browser.close();
  }
})();
