

export enum BookStatus {
    AVAILABLE = "AVAILABLE",   // Truyện đang có sẵn
    OPENING = "OPENING",       // Truyện đang chờ xử lý
    COMPLETED = "COMPLETED",   // Truyện đã hoàn thành
    DROPPED = "DROPPED",       // Truyện bị bỏ dở
    CANCELLED = "CANCELLED",   // Truyện bị hủy
    ON_HOLD = "ON_HOLD",       // Truyện tạm dừng
    LICENSED = "LICENSED"      // Truyện đã cấp phép
}