package hoangtugio.org.userservice.Controller;


import hoangtugio.org.userservice.Exception.CustomException;
import hoangtugio.org.userservice.Model.User;
import hoangtugio.org.userservice.Repository.UserRepository;
import hoangtugio.org.userservice.Service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public String getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return  userRepository.findByEmail(auth.getName()).toString();
    }

    @PostMapping("/register")
    public User createUser(@Valid @RequestBody User user) {
        return userService.save(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable int id) {
        User user = userService.findById(id);
        if (user == null) {
            throw new CustomException("User with ID " + id + " not found", HttpStatus.NOT_FOUND);
        }
        return user;
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable int id, @Valid @RequestBody User user) {
        User existingUser = userService.findById(id);
        if (existingUser == null) {
            throw new CustomException("User with ID " + id + " not found", HttpStatus.NOT_FOUND);
        }
        user.setId(id);
        return userService.update(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable int id) {
        userService.delete(id);
    }
}
