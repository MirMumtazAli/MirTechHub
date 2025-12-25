using DAL.Repositories;
using DAL.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly MTHDbContext _context;

        public INoteRepository Notes { get; }
        public ISoftwareRepository Softwares { get; }
        public IReviewRepository Reviews { get; }
        public IOrderRepository Orders { get; }
        public IOrderItemRepository OrderItems { get; }
        public ICartRepository CartItems { get; }
        public IBlogRepository Blogs { get; }

        public UnitOfWork(MTHDbContext context)
        {
            _context = context;

            Notes = new NoteRepository(_context);
            Softwares = new SoftwareRepository(_context);
            Reviews = new ReviewRepository(_context);
            Orders = new OrderRepository(_context);
            OrderItems = new OrderItemRepository(_context);
            CartItems = new CartRepository(_context);
            Blogs = new BlogRepository(_context);
        }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
