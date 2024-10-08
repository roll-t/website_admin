class HandleCookie {
    /**
     * Lưu cookie với giá trị và thời gian hết hạn
     * @param key - Tên cookie
     * @param value - Giá trị cookie
     * @param days - Số ngày cookie còn hiệu lực
     */
    static setCookie(key: string, value: string, days: number) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = key + "=" + (value || "") + expires + "; path=/";
    }

    /**
     * Lấy giá trị của một cookie theo tên
     * @param key - Tên cookie
     * @returns Giá trị của cookie nếu tồn tại, ngược lại trả về chuỗi rỗng
     */
    static getCookie(key: string): string {
        const nameEQ = key + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return "";
    }

    /**
     * Xóa cookie
     * @param key - Tên cookie cần xóa
     */
    static deleteCookie(key: string) {
        document.cookie = key + '=; Max-Age=-99999999;';
    }
}

export default HandleCookie