using Dapper;
using DefaultNamespace;
using Npgsql;

namespace infrastructure.BoxRepository;

public class BoxRepository
{
    private NpgsqlDataSource _dataSource;


    public BoxRepository(NpgsqlDataSource dataSource)
    {
        _dataSource = dataSource;
    }

    public IEnumerable<Box> getAllBoxes()
    {
        var sql = @"SELECT * FROM BoxFactory.box;";

        using (var conn = _dataSource.OpenConnection())
        {
            return conn.Query<Box>(sql);
        }
    }
    
}