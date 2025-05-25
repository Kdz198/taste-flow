package hoangtugio.org.userservice.UserService;

import hoangtugio.org.userservice.Exception.CustomException;
import hoangtugio.org.userservice.Model.User;
import hoangtugio.org.userservice.UserRepository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User save (User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new CustomException("Email " + user.getEmail() + " already exists", HttpStatus.BAD_REQUEST);
        }
        if (userRepository.existsByPhone(user.getPhone())) {
            throw new CustomException("Phone " + user.getPhone() + " already exists", HttpStatus.BAD_REQUEST);
        }
        return userRepository.save(user);
    }

    public User findById(int id) {
        return userRepository.findById(id).orElseThrow();
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User update(User user) {
        User existingUser = findById(user.getId());
        if (existingUser == null) {
            throw new CustomException("User with ID " + user.getId() + " not found", HttpStatus.NOT_FOUND);
        }
        if (!existingUser.getEmail().equals(user.getEmail()) && userRepository.existsByEmail(user.getEmail())) {
            throw new CustomException("Email " + user.getEmail() + " already exists", HttpStatus.BAD_REQUEST);
        }
        return userRepository.save(user);
    }


    public void delete(int id) {
        User user = findById(id);
        if (user == null) {
            throw new CustomException("User with ID " + id + " not found", HttpStatus.NOT_FOUND);
        }
        userRepository.delete(user);
    }

}
