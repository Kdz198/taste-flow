package hoangtugio.org.userservice.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class OTP {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email; // Lưu email thay vì customerId
    @Column(nullable = false, length = 6)
    private String otp;
    @Column(nullable = false)
    private LocalDateTime expiryDate;
    @Column(nullable = false)
    private boolean isUsed = false;

}
