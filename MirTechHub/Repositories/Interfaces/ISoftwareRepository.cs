public interface ISoftwareRepository
{
    Task<IEnumerable<Software>> GetAllAsync();
    Task<Software?> GetByIdAsync(int id);
    Task AddAsync(Software software);
    void Update(Software software);
    void SoftDelete(Software software);
}
