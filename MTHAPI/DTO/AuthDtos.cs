using System.ComponentModel.DataAnnotations;

public class RegisterDto
{
    [Required(ErrorMessage = "User Name is required")]
    public required string Name { get; set; }

    [EmailAddress]
    [Required(ErrorMessage = "Email is required")]
    public required string Email { get; set; }

    [Required(ErrorMessage = "Password is required")]
    public required string Password { get; set; }
}

public class LoginDto
{
    [Required(ErrorMessage = "Email is required")]
    public required string Email { get; set; }

    [Required(ErrorMessage = "Password is required")]
    public required string Password { get; set; }
}

public class ChangePasswordDto
{
    [Required]
    public required string OldPassword { get; set; }

    [Required]
    [MinLength(8, ErrorMessage = "The new password must be at least 8 characters long.")]
    public required string NewPassword { get; set; }

    [Required]
    [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
    public required string ConfirmPassword { get; set; }
}

public class UserDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Role { get; set; }
    public required string Email { get; set; }
}