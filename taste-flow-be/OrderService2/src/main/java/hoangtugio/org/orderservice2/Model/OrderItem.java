package hoangtugio.org.orderservice2.Model;


import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
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
@Table(name = "order_items")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int orderItemId;

    @NotNull(message = "Order is mandatory")
    @ManyToOne
    @JoinColumn(name = "OrderId", nullable = false)
    private Order order;

    @NotNull(message = "Menu item ID is mandatory")
    @Column(nullable = false)
    private int dishId;

    @NotNull(message = "Quantity is mandatory")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Column(nullable = false)
    private int quantity;

    @NotNull(message = "Unit price is mandatory")
    @DecimalMin(value = "0.0", inclusive = false, message = "Unit price must be greater than 0")
    @Column(nullable = false)
    private double unitPrice;

    @NotNull(message = "Subtotal is mandatory")
    @DecimalMin(value = "0.0", inclusive = false, message = "Subtotal must be greater than 0")
    @Column(nullable = false)
    private double subtotal;

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
}