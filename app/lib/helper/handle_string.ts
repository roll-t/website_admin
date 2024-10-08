

class HandleString {

    static generateSlug(name: string): string {
        // Chuyển đổi thành chữ thường
        const lowerCaseName = name.toLowerCase();

        // Loại bỏ dấu và ký tự đặc biệt
        const normalizedString = lowerCaseName.normalize('NFD') // Chia các ký tự có dấu thành ký tự cơ bản và dấu
            .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
            .replace(/[^a-z0-9\s-]/g, ''); // Loại bỏ ký tự không phải chữ cái, số, khoảng trắng và dấu gạch nối

        // Thay thế khoảng trắng và dấu gạch nối liên tiếp bằng dấu gạch nối
        return normalizedString
            .trim()
            .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu gạch nối
            .replace(/--+/g, '-'); // Thay thế nhiều dấu gạch nối liên tiếp bằng một dấu gạch nối
    }

    static capitalizeFirstLetter(str: string): string {
        if (str.length === 0) return str; // Nếu chuỗi rỗng, trả về luôn chuỗi đó
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static extractPathFromUrl(url: string) {
        const parts = url.split('/upload/');
        if (parts.length > 1) {
            const pathWithExtension = parts[1];
            const pathParts = pathWithExtension.split('.');
            if (pathParts.length > 1) {
                const pathWithoutVersion = pathParts[0].split('/', 3);
                console.log(pathWithoutVersion)
                if (pathWithoutVersion.length > 1) {
                    return pathWithoutVersion[1] + "/" + pathWithoutVersion[2];
                }
            }
        }
        return '';
    }


}
export default HandleString