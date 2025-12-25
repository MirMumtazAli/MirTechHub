using DAL.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        INoteRepository Notes { get; }
        ISoftwareRepository Softwares { get; }
        IReviewRepository Reviews { get; }
        IOrderRepository Orders { get; }
        IOrderItemRepository OrderItems { get; }
        ICartRepository CartItems { get; }
        IBlogRepository Blogs { get; }
        Task<int> CompleteAsync();
    }


}
