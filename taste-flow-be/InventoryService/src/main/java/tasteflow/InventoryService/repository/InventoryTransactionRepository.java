package tasteflow.InventoryService.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tasteflow.InventoryService.model.InventoryTransaction;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Integer> {
}
