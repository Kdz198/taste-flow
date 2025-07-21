package tasteflow.InventoryService.repository;

import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.Length;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tasteflow.InventoryService.model.Ingredient;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Integer> {
    boolean existsByName(@NotBlank(message = "Name can not blank !") @Length(min = 10, message = "Name must greater than 10 chars") String name);
    boolean existsByNameAndIdNot(String name, int id);
}
