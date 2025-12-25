using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Repositories
{
    public class SoftwareRepository : ISoftwareRepository
    {
        private readonly MTHDbContext _context;

        public SoftwareRepository(MTHDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Software>> GetAllAsync()
        {
            return await _context.Softwares
                .Where(s => !s.IsDeleted)
                .Include(s => s.Reviews)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<Software?> GetByIdAsync(int id)
        {
            return await _context.Softwares
                .Where(s => !s.IsDeleted)
                .Include(s => s.Reviews)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task AddAsync(Software software)
        {
            await _context.Softwares.AddAsync(software);
        }

        public void Update(Software software)
        {
            _context.Softwares.Update(software);
        }

        public void SoftDelete(Software software)
        {
            software.IsDeleted = true;
            _context.Softwares.Update(software);
        }
    }


}
