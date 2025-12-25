using DAL.DAO;

public interface IBlogRepository
{
    Task<IEnumerable<Blog>> GetAllAsync();
    Task<Blog?> GetByIdAsync(int id);
    Task<Blog?> GetBySlugAsync(string slug);
    Task AddAsync(Blog blog);
    void Update(Blog blog);
    void SoftDelete(Blog blog);
}
