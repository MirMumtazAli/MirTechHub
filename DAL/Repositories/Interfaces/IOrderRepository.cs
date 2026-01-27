using System.Collections.Generic;
using System.Threading.Tasks;

public interface IOrdersRepository
{
    Task<Order?> GetByIdAsync(string orderId);

    Task<IEnumerable<Order>> GetByUserIdAsync(string userId);

    Task<IEnumerable<Order>> GetAllAsync();

    Task AddAsync(Order order);

    void Update(Order order);
}
