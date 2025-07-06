package tasteflow.InventoryService.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
public class MenuDTO {
    private String _id;
    private String name;
    private double price;
    private Boolean status;
    private List<String> category;
    private List<ReceiptItem> receipt;

}
