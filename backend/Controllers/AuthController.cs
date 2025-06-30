using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using eshop_api.DTOs;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;

    public AuthController(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDTO model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Check if user already exists
        var existingUser = await _userManager.FindByEmailAsync(model.Email);
        if (existingUser != null)
        {
            return BadRequest(new AuthResponseDTO
            {
                IsSuccess = false,
                Message = "User with this email already exists"
            });
        }

        // Check if username already exists
        var existingUsername = await _userManager.FindByNameAsync(model.Username);
        if (existingUsername != null)
        {
            return BadRequest(new AuthResponseDTO
            {
                IsSuccess = false,
                Message = "User with this username already exists"
            });
        }

        var user = new IdentityUser
        {
            UserName = model.Username,
            Email = model.Email,
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (result.Succeeded)
        {
            await _userManager.AddToRoleAsync(user, "User");
            var token = await GenerateJwtToken(user);
            return Ok(new AuthResponseDTO
            {
                IsSuccess = true,
                Message = "User registered successfully",
                Token = token,
                Username = user.UserName,
                Email = user.Email,
                Roles = new List<string> { "User" }
            });
        }

        return BadRequest(new AuthResponseDTO
        {
            IsSuccess = false,
            Message = string.Join(", ", result.Errors.Select(e => e.Description))
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDTO model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        IdentityUser user = null;
        // Try to find by email first
        if (model.Email.Contains("@"))
        {
            user = await _userManager.FindByEmailAsync(model.Email);
        }
        // If not found, try by username
        if (user == null)
        {
            user = await _userManager.FindByNameAsync(model.Email);
        }
        if (user == null)
        {
            return BadRequest(new AuthResponseDTO
            {
                IsSuccess = false,
                Message = "Invalid username/email or password"
            });
        }

        var result = await _userManager.CheckPasswordAsync(user, model.Password);
        if (!result)
        {
            return BadRequest(new AuthResponseDTO
            {
                IsSuccess = false,
                Message = "Invalid username/email or password"
            });
        }

        var roles = await _userManager.GetRolesAsync(user);
        var token = await GenerateJwtToken(user);

        return Ok(new AuthResponseDTO
        {
            IsSuccess = true,
            Message = "Login successful",
            Token = token,
            Username = user.UserName,
            Email = user.Email,
            Roles = roles.ToList()
        });
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound();

        var roles = await _userManager.GetRolesAsync(user);
        return Ok(new
        {
            id = user.Id,
            userId = user.Id,
            email = user.Email,
            username = user.UserName,
            roles = roles.ToList()
        });
    }

    private async Task<string> GenerateJwtToken(IdentityUser user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.Email)
        };

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["JWT:ValidIssuer"],
            audience: _configuration["JWT:ValidAudience"],
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
} 