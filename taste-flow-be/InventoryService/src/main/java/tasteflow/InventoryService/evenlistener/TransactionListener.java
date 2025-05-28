package tasteflow.InventoryService.evenlistener;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import tasteflow.InventoryService.model.IngredientDetail;
import tasteflow.InventoryService.model.InventoryTransaction;
import tasteflow.InventoryService.repository.InventoryTransactionRepository;

@Component
public class TransactionListener {
    @Autowired
    private InventoryTransactionRepository inventoryTransactionRepository;

    @EventListener
    public InventoryTransaction handleTransactionEvent(IngredientDetail ingredientDetail) {
        InventoryTransaction inventoryTransaction = new InventoryTransaction();
        inventoryTransaction.setIngredient(ingredientDetail.getIngredient());
        inventoryTransaction.setQuantity(ingredientDetail.getQuantity());
        inventoryTransaction.setDate(inventoryTransaction.getDate());
        inventoryTransaction.setTransactionType(true);
        return inventoryTransactionRepository.save(inventoryTransaction);
    }
}
