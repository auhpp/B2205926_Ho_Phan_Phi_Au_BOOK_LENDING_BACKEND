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
            <h3 style="color: red;">CẢNH BÁO QUÁ HẠN</h3>
            <p>Chào ${loan.reader.fullName},</p>
            <p>Bạn đã trễ hạn trả sách <strong>${diffDays} ngày</strong>.</p>
            <p>Vui lòng xem chi tiết phiếu mượn tại:
                <a href="${frontendUrl}" style="color: blue; text-decoration: underline;">
                    ${loan._id}
                </a>
            </p>
            <p>Vui lòng mang sách đến thư viện trả ngay để tránh phí phạt tăng thêm.</p>
            <p>Mã phiếu: ${loan._id}</p>
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
    fromDate.setDate(fromDate.getDate() + 1);
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
            <h3>Nhắc nhở trả sách</h3>
            <p>Chào ${loan.reader.fullName},</p>
            <p>Hệ thống nhắc bạn sắp đến hạn trả sách.</p>
            <p>Ngày hết hạn: ${returnDate.toLocaleDateString('vi-VN')}</p>
            <p>Vui lòng xem chi tiết phiếu mượn tại:
                <a href="${frontendUrl}" style="color: blue; text-decoration: underline;">
                    ${loan._id}
                </a>
            </p>
        `;

        await sendEmail(loan.reader.email, "Nhắc nhở: Sắp đến hạn trả sách", content);
    }
};
const startCronJob = () => {
    // Cấu hình chạy mỗi ngày vào lúc 7:00 sáng
    // Format: Phút | Giờ | Ngày | Tháng | Thứ
    cron.schedule("0 7 * * *", () => {
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