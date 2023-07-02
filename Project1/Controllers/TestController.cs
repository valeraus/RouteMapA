using Microsoft.AspNetCore.Mvc;

namespace Project1.Controllers
{
    public class TestController : Controller
    {
        public IActionResult Login(string login, string pass)
        {
            if (login =="V" && pass == "1")
            {
                return Json("a6984325-9a3b-49ea-a18e-15ac865af023");
            } 
            return BadRequest();
        } 
        public IActionResult Autorize(string token)
        {
            if (token == "a6984325-9a3b-49ea-a18e-15ac865af023")
			{
				return Json("a6984325-9a3b-49ea-a18e-15ac865af023");
			}
			return BadRequest();
		}
    }
}
