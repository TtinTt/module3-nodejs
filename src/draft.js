// Số UID bắt đầu và kết thúc
const startUID = 1;
const endUID = 10; // Thay đổi giá trị này theo nhu cầu của bạn

for (let uid = startUID; uid <= endUID; uid++) {
  // Tạo đường dẫn với UID tăng dần
  const url = `http://sellaccs247.com/roundcubemail-1.4.11/?_task=mail&_mbox=INBOX&_uid=${uid}&_action=show`;

  await page.goto(url);

  // Lấy tất cả các thẻ <a> trên trang web
  const anchorElements = await page.evaluate(() => {
    const anchors = document.getElementsByTagName("a");
    return Array.from(anchors).map((a) => a.getAttribute("href"));
  });

  // Tạo một mảng để lưu trữ các địa chỉ email
  const emailAddresses = [];

  // Lặp qua các thẻ <a> và kiểm tra thuộc tính href của mỗi thẻ
  for (const href of anchorElements) {
    if (href) {
      // Sử dụng regex để tìm các địa chỉ email trong thuộc tính href
      const emailsInHref = href.match(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/g
      );

      if (emailsInHref) {
        emailAddresses.push(...emailsInHref);
      }
    }
  }

  // Lọc các địa chỉ email không chứa "abc" hoặc "def"
  const filteredEmails = emailAddresses.filter(
    (email) => !/(abc|def)/i.test(email)
  );

  // In các địa chỉ email đã lọc ra console
  console.log(`Dữ liệu từ ${url}: ${filteredEmails}`);
}
