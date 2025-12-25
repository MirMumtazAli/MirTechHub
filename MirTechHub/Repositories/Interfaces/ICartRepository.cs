using DAL.DAO;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Repositories.Interfaces
{
    public interface ICartRepository
    {
        Task<IEnumerable<Cart>> GetUserCartAsync(int userId);
        Task<Cart?> GetByIdAsync(int id);
        Task AddAsync(Cart cartItem);
        void Update(Cart cartItem);
        void SoftDelete(Cart cartItem);
    }
}
