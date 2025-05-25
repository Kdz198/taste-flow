package tasteflow.InventoryService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import tasteflow.InventoryService.exception.CustomException;
import tasteflow.InventoryService.model.Ingredient;
import tasteflow.InventoryService.repository.IngredientRepository;

import java.util.List;

@Service
public class IngredientService {
    @Autowired
    private IngredientRepository repo;

    public List<Ingredient> getAllIngredients() {
        return repo.findAll();
    }

    public Ingredient getIngredientById(int id) {
        if(repo.existsById(id)) {
            return repo.findById(id).get();
        }
        else{
            throw new CustomException("Ingredient does not exist !", HttpStatus.NOT_FOUND);
        }
    }

    public Ingredient addIngredient(Ingredient ingredient) {
        if(repo.existsByName(ingredient.getName())) {
            throw new CustomException("Ingredient is exist !", HttpStatus.CONFLICT);
        }
        return repo.save(ingredient);
    }

    public Ingredient updateIngredient(Ingredient ingredient) {
        if(repo.existsById(ingredient.getId())) {
            if(repo.existsByName(ingredient.getName())) {
                throw new CustomException("Ingredient is exist !", HttpStatus.CONFLICT);
            }
            return repo.save(ingredient);
        }

        else{
            throw new CustomException("Ingredient does not exist !", HttpStatus.NOT_FOUND);
        }
    }

    public void deleteIngredient(int id) {
        if(repo.existsById(id)) {
            repo.deleteById(id);
        }
        else{
            throw new CustomException("Ingredient does not exist !", HttpStatus.NOT_FOUND);
        }
    }
}
