
using MenuServices.Application.Context;
using Microsoft.EntityFrameworkCore;

namespace MenuServices.Application.Interfaces
{
    public abstract class AsbtractRepositories<T> : IRepositories<T> where T : class
    {
        protected readonly AppDbContext _context;

        protected AsbtractRepositories( AppDbContext context )
        {
            _context = context ?? throw new ArgumentNullException( nameof( context ) );
        }

        public async Task<T> AddAsync( T entity )
        {
            var entry = await _context.Set<T>().AddAsync( entity );
            await _context.SaveChangesAsync();
            return entry.Entity;
        }

        public virtual Task<bool> DeleteAsync( int id )
        {
            var entry = _context.Set<T>().Find( id );
            if( entry == null )
            {
                return Task.FromResult( false );
            }
            _context.Set<T>().Remove( entry );
            return _context.SaveChangesAsync().ContinueWith( t => t.Result > 0 );
        }

        public virtual Task<IEnumerable<T>> GetAllAsync()
        {
            var entries = _context.Set<T>().ToListAsync();
            return entries.ContinueWith( t => ( IEnumerable<T> ) t.Result );
        }

        public virtual async Task<T> GetByIdAsync( int id )
        {
            var entry = await _context.Set<T>().FindAsync( id );
            if( entry == null )
                throw new KeyNotFoundException( $"Entity with id {id} not found." );
            return entry;
        }

        public Task<bool> LoadDumpData( List<T> entities )
        {
            _context.Set<T>().AddRange( entities );
            return _context.SaveChangesAsync().ContinueWith( t => t.Result > 0 );
        }

        public Task<T> UpdateAsync( T entity )
        {
            _context.Set<T>().Update( entity );
            return _context.SaveChangesAsync().ContinueWith( t => entity );
        }
    }
}
