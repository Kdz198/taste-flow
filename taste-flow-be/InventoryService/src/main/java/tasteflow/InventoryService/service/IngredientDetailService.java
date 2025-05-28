package tasteflow.InventoryService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import tasteflow.InventoryService.exception.CustomException;
import tasteflow.InventoryService.model.IngredientDetail;
import tasteflow.InventoryService.repository.IngredientDetailRepository;

import java.util.List;

@Service
public class IngredientDetailService {
    @Autowired
    private IngredientDetailRepository repo;
    @Autowired
    private ApplicationEventPublisher eventPublisher;

    public List<IngredientDetail> findAll() {
        return repo.findAll();
    }

    public IngredientDetail findById(int id) {
        if(!repo.existsById(id)) {
            throw new CustomException("Not Found !", HttpStatus.NOT_FOUND);
        }
        else{
            return repo.findById(id).get();
        }
    }

    public IngredientDetail save(IngredientDetail ingredientDetail) {
        eventPublisher.publishEvent(ingredientDetail);
        return repo.save(ingredientDetail);
    }

    public IngredientDetail update(IngredientDetail ingredientDetail) {
        if(repo.existsById(ingredientDetail.getId())) {
            return repo.save(ingredientDetail);
        }
       else {
           throw new CustomException("Not Found !", HttpStatus.NOT_FOUND);
        }
    }

    public void delete(int id) {
        if(repo.existsById(id)) {
            repo.deleteById(id);
        }
        else {
            throw new CustomException("Not Found !", HttpStatus.NOT_FOUND);
        }

    }

    public List<IngredientDetail> findByIngredient(int id){
        return repo.findByIngredientId(id);
    }
}
