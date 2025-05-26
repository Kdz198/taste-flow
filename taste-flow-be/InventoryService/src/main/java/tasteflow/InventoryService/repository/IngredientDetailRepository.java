package tasteflow.InventoryService.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tasteflow.InventoryService.model.IngredientDetail;

import java.util.List;

@Repository
public interface IngredientDetailRepository extends JpaRepository<IngredientDetail, Integer> {
    public List<IngredientDetail> findByIngredientId(int id);
}
