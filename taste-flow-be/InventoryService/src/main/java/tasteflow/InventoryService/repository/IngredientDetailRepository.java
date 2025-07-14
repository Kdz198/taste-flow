package tasteflow.InventoryService.repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tasteflow.InventoryService.model.IngredientDetail;

import java.util.List;

@Repository
public interface IngredientDetailRepository extends JpaRepository<IngredientDetail, Integer> {
    public List<IngredientDetail> findByIngredientId(int id);
    public List<IngredientDetail> findByIngredientIdOrderByExpireDateAsc(int id);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM IngredientDetail i WHERE i.id = :id")
    IngredientDetail lockById(@Param("id") int id);
}
