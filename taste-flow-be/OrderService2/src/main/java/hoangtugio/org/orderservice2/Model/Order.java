package hoangtugio.org.orderservice2.Model;


import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Nationalized;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int orderId;

    @NotNull(message = "User ID is mandatory")
    private int userId;

    @NotNull(message = "Total amount is mandatory")
    @DecimalMin(value = "0.0", inclusive = false, message = "Total amount must be greater than 0")
    @Column(nullable = false)
    private double totalAmount;

    @NotNull(message = "Status is mandatory")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;

    @NotNull(message = "Delivery address is mandatory")
    @Size(min = 0, max = 255, message = "Delivery address must be between 0 and 255 characters")
    @Nationalized
    private String deliveryAddress;


    private int paymentId;

    @Size(max = 50, message = "Discount code must not exceed 50 characters")
    @Column
    private String discountCode;

    @Size(max = 255, message = "Notes must not exceed 255 characters")
    @Nationalized
    @Column
    private String notes;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Enum for order status
    public enum OrderStatus {
        PENDING, CONFIRMED, READY_FOR_PAYMENT, COMPLETED, CANCELLED
    }
}