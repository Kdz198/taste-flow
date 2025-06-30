package tasteflow.paymentservice.RabbitMQ;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Nationalized;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrderEvent {

    private int orderId;
    private int userId;
    private double totalAmount;
    private OrderStatus status = OrderStatus.PENDING;
    private String deliveryAddress;
    private int paymentId;
    private String discountCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Enum for order status
    public enum OrderStatus {
        PENDING, CONFIRMED, DELIVERING, COMPLETED, CANCELLED
    }
}