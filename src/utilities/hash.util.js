import bcrypt from 'bcrypt';
import {SALT_ROUNDS} from '../config/hash.config.js';

const encryptPassword = (value) => {
    return bcrypt.hashSync(value, SALT_ROUNDS);
}

const comparePassword = (value, encryptedValue) => {
    return bcrypt.compareSync(value, encryptedValue);
}

export {
    encryptPassword,
    comparePassword
}
