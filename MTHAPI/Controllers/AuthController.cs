using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto registerDto)
    {
        var user = new ApplicationUser
        {
            Name = registerDto.Name,
            UserName = registerDto.Email,
            Email = registerDto.Email
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        await _userManager.AddToRoleAsync(user, "User");
        return Ok(new { Message = "Registration successful" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        var result = await _signInManager.PasswordSignInAsync(
            loginDto.Email,
            loginDto.Password,
            isPersistent: false,
            lockoutOnFailure: false);

        if (!result.Succeeded)
        {
            return Unauthorized(new { Message = "Invalid credentials" });
        }

        var user = await _userManager.FindByEmailAsync(loginDto.Email);
        if (user == null) return Unauthorized();

        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? "User";

        // ⭐ GENERATE JWT TOKEN
        var token = GenerateJwtToken(user, role);

        // ⭐ DEBUG: Log the token to backend console
        Console.WriteLine($"Generated Token: {token}");
        Console.WriteLine($"Token Length: {token.Length}");

        // ⭐ RETURN THIS EXACT FORMAT
        return Ok(new
        {
            token = token,  // Must be a JWT string
            expiration = DateTime.Now.AddHours(24).ToString("o"),
            user = new
            {
                id = user.Id,
                name = user.Name,
                email = user.Email,
                role = role.ToLower()
            }
        });
    }

    // ⭐ MAKE SURE THIS METHOD EXISTS
    private string GenerateJwtToken(ApplicationUser user, string role)
    {
        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

        var credentials = new SigningCredentials(
            securityKey,
            SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id),
        new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
        new Claim(ClaimTypes.Name, user.Name ?? ""),
        new Claim(ClaimTypes.NameIdentifier, user.Id),
        new Claim(ClaimTypes.Email, user.Email ?? ""),
        new Claim(ClaimTypes.Role, role),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(24),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok();
    }

    [Authorize]
    [HttpGet("currentuser")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return Unauthorized();

        var roles = await _userManager.GetRolesAsync(user);

        var userDto = new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = roles.FirstOrDefault()?.ToLower() ?? "user"
        };

        return Ok(userDto);
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return NotFound(new { Message = "User not found" });
        }

        var result = await _userManager.ChangePasswordAsync(
            user,
            dto.OldPassword,      // ⭐ Changed from CurrentPassword
            dto.NewPassword
        );

        if (!result.Succeeded)
        {
            return BadRequest(new { Message = "Failed to change password. Please check your current password." });
        }

        return Ok(new { Message = "Password changed successfully" });
    }
}