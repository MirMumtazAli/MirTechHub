using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Repositories.Interfaces
{
    public interface IReviewRepository
    {
        Task<IEnumerable<Review>> GetAllAsync();
        Task<IEnumerable<Review>> GetBySoftwareIdAsync(int softwareId);
        Task<IEnumerable<Review>> GetByNoteIdAsync(int noteId);
        Task<Review?> GetByIdAsync(int id);

        Task AddAsync(Review review);
        void Update(Review review);
        void SoftDelete(Review review);
    }

}
