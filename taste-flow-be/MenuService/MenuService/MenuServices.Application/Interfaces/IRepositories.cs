namespace MenuServices.Application.Interfaces
{
    public interface IRepositories<T>
        where T : class
    {
        public Task<T> GetByIdAsync( int id );
        public Task<IEnumerable<T>> GetAllAsync();
        public Task<T> AddAsync( T entity );
        public Task<T> UpdateAsync( T entity );
        public Task<bool> DeleteAsync( int id );
        public Task<bool> LoadDumpData( List<T> entities );
    }
}
