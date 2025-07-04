package tasteflow.paymentservice.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UrlPayment {

    @Id
    int orderId;
    @Column(columnDefinition = "NVARCHAR(MAX)")
    String url;
    boolean isUsed = false;
    LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(10);
}
