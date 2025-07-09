package tasteflow.InventoryService.dto;

import lombok.Data;

import java.util.List;

@Data
public class Menu {
    private boolean success;
    private String message;
    private List<IngredientDTO> data;
}
