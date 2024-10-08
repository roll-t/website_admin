export class HandleDateFormat {
    static dateVN = (dateInput: string): string => {
        const date = new Date(dateInput);
        const formattedDate = date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,  // Định dạng 24h
            timeZone: 'Asia/Ho_Chi_Minh'  // Đảm bảo sử dụng múi giờ Việt Nam
        });
        return formattedDate;
    }
}
