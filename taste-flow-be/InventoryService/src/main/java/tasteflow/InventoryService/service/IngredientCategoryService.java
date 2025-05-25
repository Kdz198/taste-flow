package tasteflow.InventoryService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import tasteflow.InventoryService.exception.CustomException;
import tasteflow.InventoryService.model.IngredientCategory;
import tasteflow.InventoryService.repository.IngredientCategoryRepository;

import java.util.List;

@Service
public class IngredientCategoryService {
    @Autowired
    private IngredientCategoryRepository repo;

    public List<IngredientCategory> findAll() {
        return repo.findAll();
    }

    public IngredientCategory findById(int id) {
        if(repo.existsById(id)) {
            return repo.findById(id).get();
        }
        else{
            throw new CustomException("Category not found !", HttpStatus.NOT_FOUND);
        }
    }

    public IngredientCategory save(IngredientCategory ingredientCategory) {
        if(repo.existsByName(ingredientCategory.getName())) {
            throw new CustomException("Category already exists !", HttpStatus.CONFLICT);
        }
        return repo.save(ingredientCategory);
    }

    public IngredientCategory update(IngredientCategory ingredientCategory) {
        if(repo.existsById(ingredientCategory.getId())) {
            if(repo.existsByName(ingredientCategory.getName())) {
                throw new CustomException("Category already exists !", HttpStatus.CONFLICT);
            }
            return repo.save(ingredientCategory);
        }
        else{
            throw new CustomException("Category not found !", HttpStatus.NOT_FOUND);
        }
    }

    public void delete(int id) {
        if(repo.existsById(id)) {
            repo.deleteById(id);
        }
        else{
            throw new CustomException("Category not found !", HttpStatus.NOT_FOUND);
        }
    }
}
