package tasteflow.InventoryService.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tasteflow.InventoryService.model.IngredientCategory;

@Repository
public interface IngredientCategoryRepository extends JpaRepository<IngredientCategory, Integer> {
    boolean existsByName(String name);
}
