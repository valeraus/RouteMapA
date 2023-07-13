using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Project1.Models;
using Project1.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Project1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthorizationController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AuthServices _authServices;

        public AuthorizationController(IConfiguration configuration, AuthServices authServices)
        {
            _configuration = configuration;
            _authServices = authServices;
        }

        [Authorize]
        [HttpPost("update")]
        public async Task<IActionResult> Update()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null)
            {
                return Unauthorized();
            }

            var userId = identity.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
            if (userId == null)
            {
                return BadRequest();
            }

            var user = await _authServices.GetUserById(Guid.Parse(userId));
            if (user.Data == null)
            {
                return BadRequest();
            }

            return Ok(new
            {
                Token = CreateJwtTokenFromUser(user.Data),
                User = user.Data
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UsersModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _authServices.SignIn(model);
                if (user.Data == null)
                {
                    return Unauthorized();
                }

                return Ok(new
                {
                    Token = CreateJwtTokenFromUser(user.Data),
                    User = user.Data
                });
            }
            return Unauthorized();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UsersModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _authServices.SignUp(model);
                if (user.Data == null)
                {
                    return Unauthorized();
                }


                return Ok(new
                {
                    Token = CreateJwtTokenFromUser(user.Data),
                    User = user.Data
                });
            }
            return Unauthorized();
        }

        string CreateJwtTokenFromUser(UsersModel user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:Settings"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                        new Claim("userId", user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
            return tokenString;
        }
    }
}
