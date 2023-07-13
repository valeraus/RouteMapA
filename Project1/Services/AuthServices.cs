
using Project1.Models;

namespace Project1.Services
{
    public class AuthServices
    {
        List<UsersModel> _userDb;
        public AuthServices()
        {
            _userDb = new List<UsersModel>()
            {
                new UsersModel()
                {
                    Id = Guid.NewGuid(),
                    Email ="valus@ukr.net",
                    Password= "123"
                }
            };
        }

        public async Task<BaseResponce<UsersModel?>> SignIn(UsersModel model)
        {
            BaseResponce<UsersModel> responce = new BaseResponce<UsersModel>();
            try
            {
                var users = _userDb;
                var isUserExist = users.FirstOrDefault(x => x.Email == model.Email && x.Password == model.Password);
                if (isUserExist == null)
                {
                    throw new Exception();
                }

                responce.Data = isUserExist;
            }
            catch (Exception ex)
            {
                responce.Message = ex.Message;
            }
            return responce;
        }

        public async Task<BaseResponce<UsersModel?>> GetUserById(Guid id)
        {
            BaseResponce<UsersModel> responce = new BaseResponce<UsersModel>();
            try
            {
                var isUserExist = _userDb.FirstOrDefault(x => x.Id == id);
                if (isUserExist == null)
                {
                    throw new Exception();
                }

                responce.Data = isUserExist;
            }
            catch (Exception ex)
            {
                responce.Message = ex.Message;
            }
            return responce;
        }

        public async Task<BaseResponce<UsersModel>> SignUp(UsersModel model)
        {
            BaseResponce<UsersModel> responce = new BaseResponce<UsersModel>();
            try
            {
                var isUserExist = _userDb.FirstOrDefault(x => x.Email == model.Email && x.Password == model.Password);
                if (isUserExist != null)
                {
                    throw new Exception();
                }
                _userDb.Add(model);
            }

            catch (Exception ex)
            {
                responce.Message = ex.Message;
            }
            return responce;
        }
    }
}
