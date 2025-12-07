import cron from "node-cron"
import sendEmail from "../utils/mailer.js"
import LoanSlipRepository from "../repositories/loanSlip.repository.js"
import MongoDB from "../utils/mongodb.util.js"
import ConfigurationRepository from "../repositories/configuration.repository.js"
import { Configuration } from "../enums/configuration.enum.js"
import { LoanSlipStatus } from "../enums/loanSlipStatus.enum.js"

const checkAndNotify = async () => {
    try {

        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));

        await handleOverdueLoans(startOfToday);
        await handleUpcomingLoans(startOfToday);
    } catch (error) {
        console.error("Lỗi trong Cron Job:", error);
    }
}
const handleOverdueLoans = async (startOfToday) => {
    const loanSlipRepository = new LoanSlipRepository(MongoDB.client)

    const overdueLoans = await loanSlipRepository.findOverdueLoans({
        currentStartOfDay: startOfToday
    });

    if (!overdueLoans || overdueLoans.length === 0) return;

    console.log(`Tìm thấy ${overdueLoans.length} phiếu quá hạn.`);

    for (const loan of overdueLoans) {
        if (!loan.reader || !loan.reader.email) continue;

        const returnDate = new Date(loan.returnDate);
        const diffTime = Math.abs(startOfToday - returnDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const frontendUrl = `http://localhost:5000/loanSlips/${loan._id}`

        const content = `
<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <div style="background-color: #dc3545; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">
                CẢNH BÁO QUÁ HẠN
            </h2>
        </div>

        <div style="padding: 30px 25px;">
            <p style="color: #333333; font-size: 16px; margin-bottom: 20px;">
                Chào <strong>${loan.reader.fullName}</strong>,
            </p>
            
            <p style="color: #555555;">
                Hệ thống ghi nhận bạn vẫn chưa hoàn trả sách theo đúng quy định mượn trả của thư viện.
            </p>

            <div style="background-color: #f8d7da; border-left: 5px solid #dc3545; padding: 20px; margin: 25px 0; border-radius: 4px;">
                <p style="margin: 0; color: #721c24; font-size: 16px;">
                    Số ngày quá hạn: 
                    <span style="font-size: 24px; font-weight: bold; color: #dc3545; display: block; margin-top: 5px;">
                        ${diffDays} ngày
                    </span>
                </p>
                <p style="margin: 15px 0 0 0; color: #721c24; font-size: 14px; border-top: 1px solid #f5c6cb; padding-top: 10px;">
                    Mã phiếu: <strong>${loan.loanCode}</strong>
                </p>
            </div>

            <p style="color: #333333; font-weight: bold; margin-bottom: 25px;">
                Vui lòng mang sách đến thư viện trả <span style="text-decoration: underline; color: #dc3545;">NGAY LẬP TỨC</span> để tránh phí phạt tiếp tục tăng thêm.
            </p>

            <div style="text-align: center; margin-bottom: 20px;">
                <a href="${frontendUrl}" style="background-color: #c82333; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                    Xem chi tiết phiếu phạt
                </a>
            </div>
        </div>

        <div style="background-color: #eeeeee; padding: 15px; text-align: center; font-size: 12px; color: #666666;">
            <p style="margin: 0;">© 2025 Hệ thống quản lý thư viện - Book Lending</p>
            <p style="margin: 5px 0 0;">Email này yêu cầu hành động gấp.</p>
        </div>
    </div>
</div>
`;

        await sendEmail(loan.reader.email, "CẢNH BÁO: Bạn đang giữ sách quá hạn", content);
    }
};

const handleUpcomingLoans = async (startOfToday) => {
    const loanSlipRepository = new LoanSlipRepository(MongoDB.client)
    const configurationRepository = new ConfigurationRepository(MongoDB.client)

    const noticeBeforeDateDue = await configurationRepository.findByName(Configuration.NOTICE_BEFORE_DUE_DATE)

    const targetDate = new Date(startOfToday);
    targetDate.setDate(targetDate.getDate() + noticeBeforeDateDue.value);

    const fromDate = new Date(startOfToday);
    // fromDate.setDate(fromDate.getDate() + 1);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(startOfToday);
    toDate.setDate(toDate.getDate() + noticeBeforeDateDue.value);
    toDate.setHours(23, 59, 59, 999);

    console.log(`Đang quét sách cần trả trong khoảng: ${fromDate.toLocaleDateString()} đến ${toDate.toLocaleDateString()}`);

    const upcomingLoans = await loanSlipRepository.findAllByReturnDateAndStatus({
        startOfDay: fromDate,
        endOfDay: toDate,
        status: LoanSlipStatus.BORROWED
    });

    if (!upcomingLoans || upcomingLoans.length === 0) return;

    for (const loan of upcomingLoans) {
        if (!loan.reader || !loan.reader.email) continue;
        const frontendUrl = `http://localhost:5000/loanSlips/${loan._id}`
        const returnDate = new Date(loan.returnDate);

        const content = `
<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <div style="background-color: #2c3e50; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 20px; text-transform: uppercase;">
                Nhắc nhở hạn trả sách
            </h2>
        </div>

        <div style="padding: 30px 25px;">
            <p style="color: #333333; font-size: 16px; margin-bottom: 20px;">
                Thân gửi <strong>${loan.reader.fullName}</strong>,
            </p>
            
            <p style="color: #555555; margin-bottom: 25px;">
                Hệ thống thư viện xin thông báo phiếu mượn sách của bạn đang sắp đến hạn trả. Để tránh phát sinh phí phạt, bạn vui lòng sắp xếp thời gian hoàn trả sách đúng hạn.
            </p>

            <div style="background-color: #fff3cd; border-left: 5px solid #ffc107; padding: 15px; margin-bottom: 30px; border-radius: 4px;">
                <p style="margin: 0; color: #856404; font-size: 15px;">
                    <strong>Hạn trả sách:</strong> 
                    <span style="font-size: 18px; color: #d9534f; font-weight: bold;">
                        ${returnDate.toLocaleDateString('vi-VN')}
                    </span>
                </p>
                <p style="margin: 10px 0 0 0; color: #856404; font-size: 14px;">
                    <strong>Mã phiếu mượn:</strong> ${loan.loanCode}
                </p>
            </div>

            <div style="text-align: center; margin-bottom: 20px;">
                <a href="${frontendUrl}" style="background-color: #007bff; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block;">
                    Xem chi tiết phiếu mượn
                </a>
            </div>
            
            <p style="font-size: 13px; color: #999999; text-align: center; margin-top: 30px;">
                Nếu bạn đã trả sách, vui lòng bỏ qua email này.
            </p>
        </div>

        <div style="background-color: #eeeeee; padding: 15px; text-align: center; font-size: 12px; color: #666666;">
            <p style="margin: 0;">© 2025 Hệ thống quản lý thư viện - Book Lending</p>
            <p style="margin: 5px 0 0;">Đây là email tự động, vui lòng không phản hồi.</p>
        </div>
    </div>
</div>
`;

        await sendEmail(loan.reader.email, "Nhắc nhở: Sắp đến hạn trả sách", content);
    }
};
const startCronJob = () => {
    // Cấu hình chạy mỗi ngày vào lúc 7:00 sáng
    // Format: Phút | Giờ | Ngày | Tháng | Thứ
    cron.schedule("27 20 * * *", () => {
        checkAndNotify()
    },
        {
            scheduled: true,
            timezone: "Asia/Ho_Chi_Minh"
        }
    );
    console.log("Cron Job: Đã lên lịch kiểm tra hạn trả sách lúc 7:00 sáng hàng ngày.");
}

export default startCronJob;