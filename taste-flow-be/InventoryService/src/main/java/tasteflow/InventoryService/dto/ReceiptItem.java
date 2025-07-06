package tasteflow.InventoryService.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class ReceiptItem {
    private int idIngredient;
    private int quantity;
}
