package tasteflow.InventoryService.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private int id;

    @Column(name = "IngredientDetailId")
    private int ingredientDetailId;

    @Column(name = "Quantity")
    private int quantity;

    @JoinColumn(name = "OrderId")
    @ManyToOne
    private InventoryOrder inventoryOrder;

    public OrderItem(int ingredientDetailId, int quantity, InventoryOrder inventoryOrder) {
        this.ingredientDetailId = ingredientDetailId;
        this.quantity = quantity;
        this.inventoryOrder = inventoryOrder;
    }


}
