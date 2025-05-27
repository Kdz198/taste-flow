package hoangtugio.org.userservice.Repository;

import hoangtugio.org.userservice.Model.OTP;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OTPRepository extends JpaRepository<OTP, Long> {

    Optional<OTP> findTopByEmailAndOtpAndIsUsedFalseOrderByExpiryDateDesc(String email, String otpCode);
    Optional<OTP> findTopByEmailOrderByExpiryDateDesc(String email);



//    findTopBy... → Chỉ lấy 1 kết quả duy nhất (TOP 1).
//    Email → Lọc theo Email của bảng Customer.
//    expiryDateAfter(now) → Chỉ lấy OTP chưa hết hạn.
//    isUsedFalse → Chỉ lấy OTP chưa dùng.
//    orderByExpiryDateDesc → Lấy OTP mới nhất.
}
