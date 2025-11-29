import redisClient from "../utils/redis.js"
import sendEmail from "../utils/mailer.js"
import ApiError from "../api-error.js";
import MongoDB from "../utils/mongodb.util.js";
import ReaderRepository from "../repositories/reader.repository.js";
import StaffRepository from "../repositories/staff.repository.js";
import { Role } from "../enums/role.enum.js";

class OtpService {
    constructor() {
        this.staffRepository = new StaffRepository(MongoDB.client);
        this.readerRepository = new ReaderRepository(MongoDB.client);
    }
    generateOtpCode() {
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
        return otpCode;
    }

    async sendOtp({ userName, role }) {
        var account;
        if (Role.ADMIN == role) {
            account = await this.staffRepository.findByUserName(userName);
        }
        else {
            account = await this.readerRepository.findByUserName(userName);
        }
        if (!account) {
            throw new ApiError(400, "username not exist")
        }
        if (!account.email) {
            throw new ApiError(400, "User not linked email")
        }
        const email = account.email;
        const otpCode = this.generateOtpCode();
        await redisClient.setEx(`otp:${userName}`, 300, otpCode);
        const content = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
    
    <h2 style="color: #0056b3; text-align: center; border-bottom: 2px solid #0056b3; padding-bottom: 10px;">
        XÁC THỰC ĐỔI MẬT KHẨU
    </h2>

    <p style="font-size: 16px; color: #333;">Xin chào,</p>
    
    <p style="font-size: 16px; color: #333;">
        Hệ thống vừa nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. 
        Để tiếp tục, vui lòng nhập mã xác thực (OTP) dưới đây:
    </p>

    <div style="background-color: #f0f8ff; border: 1px dashed #0056b3; padding: 15px; margin: 20px 0; text-align: center;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #d32f2f; display: block;">
            ${otpCode}
        </span>
    </div>

    <p style="font-size: 16px; color: #333;">
        Mã này sẽ hết hạn sau <strong>5 phút</strong>.
    </p>

    <div style="background-color: #fff3cd; padding: 10px; border-radius: 4px; border-left: 5px solid #ffc107; margin-top: 20px;">
        <p style="margin: 0; color: #856404; font-size: 14px;">
            <strong>CẢNH BÁO:</strong> Tuyệt đối không chia sẻ mã này cho bất kỳ ai. 
            Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này hoặc liên hệ quản trị viên ngay lập tức.
        </p>
    </div>

    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="font-size: 12px; color: #888; text-align: center;">
        Đây là email tự động từ Hệ thống Quản lý Thư viện. Vui lòng không trả lời email này.
    </p>
  </div>
`;
        await sendEmail(email, "Mã OTP đổi mật khẩu", content);
    }

    async verifyOtp(otp, userName) {
        const storedOtp = await redisClient.get(`otp:${userName}`)
        console.log("otp = ", storedOtp)
        console.log("otp param = ", otp)
        if (!storedOtp || storedOtp !== otp) {
            throw new ApiError(400, "Invalid or expired OTP")
        }
    }

    async cleanOtp(userName) {
        await redisClient.del(`otp:${userName}`)
    }
}

export default OtpService;