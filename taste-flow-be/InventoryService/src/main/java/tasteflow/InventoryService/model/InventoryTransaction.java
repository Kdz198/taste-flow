package tasteflow.InventoryService.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.lang.Nullable;

import java.sql.Date;

@Entity
@Table(name="InventoryTransactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @JoinColumn(name = "ingredientId")
    @ManyToOne
    private Ingredient ingredient;

    @Nullable
    private int dishId;

    private Date date;

    @Min(value = 0,message = "Quantity must be greater than 0 !")
    private int quantity;

    @NotNull(message = "Type must not be null !")
    private boolean transactionType;
    //true: nhap
    //false :xuat
}
