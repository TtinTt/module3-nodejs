// const express = require('express');
import express from 'express'; // Phải thêm "type": "module" ở package.json
import bodyParser from 'body-parser';
import morgan from 'morgan';
import fs from 'fs';

const application = express();

// Cấu hình body parser
// parse application/x-www-form-urlencoded
application.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
application.use(bodyParser.json());

// Cấu hình morgan
const accessLogStream = fs.createWriteStream('src/logs/access.log', { flags: 'a' });
application.use(morgan('combined', { stream: accessLogStream }));

const getNextId = (items) => {
    // Trường hợp 1: nếu items rỗng thì next ID sẽ là 1
    if (items.length === 0) {
        return 1;
    }
    // Trường hợp 2: Nếu items không rỗng thì next ID sẽ bằng ID lớn nhất trong danh sách items + 1
    else {
        // Lấy tất cả ID trong danh sách items lưu vào mảng idList
        const idList = items.map(todo => {
            return todo.id;
        });

        // Lấy giá trị ID lớn nhất trong mảng idList
        const maxId = Math.max(...idList);

        // Trả về next ID: ID lớn nhất trong danh sách items + 1
        return maxId + 1;
    }
}

let contacts = []

// Search contact
application.get('/contacts', (req, res) => {
    const keyword = req.query.keyword;

    if (keyword !== undefined) {
        const searchcontacts = contacts.filter(contact => {
            return contact.id.toLowerCase().includes(keyword.toLowerCase())
                || contact.customer.toLowerCase().includes(keyword.toLowerCase())

                
        });
        res.send(searchcontacts);
    } else {
        res.send(contacts);
    }
})

// Tạo contact
application.post('/contacts', (req, res) => {
    contacts.push({
        ...req.body,
        status:0,
        id: getNextId(contacts),
        created_at: new Date(),
        updated_at: new Date()
    });

    res.status(201) // HTTP status code 201: CREATED
        .send(req.body);
});

// Lấy thông tin 1 contact
application.get('/contacts/:id', (req, res) => {
    const { id } = req.params;

    const contact = contacts.find(contact => contact.id == id);

    if (contact) {
        res.send(contact);
    } else {
        res.status(404)
            .send({
                error: 'contact not found'
            });
    }
});

application.put('/contacts/:id', (req, res) => {
    const { id } = req.params;

    // Kiểm tra contact với param id có tồn tại không
    const contact = contacts.find(contact => contact.id == id);

    // Nếu không tồn tại thì trả về lỗi
    if (!contact) {
        res.status(404)
            .send({
                error: 'contact not found'
            });
    }

    // Lấy request body
    const requestBody = req.body;
    let updatedcontact = null;

    contacts = contacts.map(contact => {
        if (contact.id == id) {
            updatedcontact = {
                ...contact,
                status:requestBody.status,
                updated_at: new Date()
            }
            return updatedcontact;
        } else {
            return contact;
        }
    });

    // Lấy lại contact sau khi update
    // const contactUpdated = contacts.find(contact => contact.id == id);
    res.send(updatedcontact)
});

application.delete('/contacts/:id', (req, res) => {
    const { id } = req.params;

    // Kiểm tra contact với param id có tồn tại không
    const contact = contacts.find(contact => contact.id == id);

    // Nếu không tồn tại thì trả về lỗi
    if (!contact) {
        res.status(404)
            .send({
                error: 'contact not found'
            });
    }

    contacts = contacts.filter(contact => contact.id != id);
    res.status(204).send(); // HTTP status code 204 (No Content) - thường được sử dụng để trả về sau khi xóa thành công
});

application.listen(8000, () => {
    console.log('Server started');
});
