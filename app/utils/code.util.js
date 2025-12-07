import { customAlphabet } from "nanoid";

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);


export const generateCode = (prefix) => {
    const now = new Date();

    // Lấy 2 số cuối của năm (2025 -> 25)
    const year = now.getFullYear().toString().slice(-2);

    // Lấy tháng (0-11) + 1, đảm bảo luôn có 2 chữ số (1 -> 01, 12 -> 12)
    const month = (now.getMonth() + 1).toString().padStart(2, '0');

    // Sinh chuỗi random 4 ký tự
    const randomSuffix = nanoid();

    return `${prefix}-${year}${month}-${randomSuffix}`;
};