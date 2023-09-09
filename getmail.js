import fs from "fs";

const getEmail = async (startUID, endUID, emailLogin, urlInput, page) => {
  const excludedEmails = ["etsy.com", "noreply", "zendesk.com", emailLogin];

  const emailSet = new Set(); // Sử dụng Set để loại bỏ các email trùng lặp

  for (let uid = startUID; uid <= endUID; uid++) {
    const url = urlInput + `&_uid=${uid}&_action=show`;

    await page.goto(url, { timeout: 3000 });

    const anchorElements = await page.evaluate(() => {
      const anchors = document.getElementsByTagName("a");
      return Array.from(anchors).map((a) => a.getAttribute("href"));
    });

    const emailAddresses = [];

    for (const href of anchorElements) {
      if (href) {
        const emailsInHref = href.match(
          /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/g
        );

        if (emailsInHref) {
          emailAddresses.push(...emailsInHref);
          console.log(uid, ": ", emailsInHref);
        }
      }
    }

    const filteredEmails = emailAddresses.filter(
      (email) => !excludedEmails.some((excluded) => email.includes(excluded))
    );

    // Thêm các địa chỉ email đã lọc vào Set để loại bỏ trùng lặp
    filteredEmails.forEach((email) => {
      emailSet.add(email);
    });
  }

  const uniqueEmails = Array.from(emailSet); // Chuyển Set thành mảng

  // Tạo tệp JSON và lưu mảng email đã lọc vào đó
  const emailData = {
    emailLogin: emailLogin,
    emails: uniqueEmails,
  };

  const jsonData = JSON.stringify(emailData, null, 2);
  fs.writeFileSync(`${emailLogin}.json`, jsonData);

  console.log(`Dữ liệu đã được lưu vào file ${emailLogin}.json`);
};

export default getEmail;
