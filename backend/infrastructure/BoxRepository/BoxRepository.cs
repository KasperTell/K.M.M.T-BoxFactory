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

    public IEnumerable<Box> GetAllBoxes()
    {
        var sql = @"SELECT * FROM BoxFactory.box ORDER BY box_id;";

        using (var conn = _dataSource.OpenConnection())
        {
            return conn.Query<Box>(sql);
        }
    }

    public Box GetBoxById(int boxId)
    {
        var sql = $@"SELECT * FROM BoxFactory.box WHERE box_id = @boxId;";

        using (var conn = _dataSource.OpenConnection())
        {
            return conn.QueryFirst<Box>(sql, new { boxId });
        }
    }

    public IEnumerable<Box> SearchBoxes(string searchQuery)
    {
        var sql = $@"SELECT * FROM BoxFactory.box WHERE product_name iLIKE '%{searchQuery}%';";

        using (var conn = _dataSource.OpenConnection())
        {
            return conn.Query<Box>(sql, new { searchQuery });
        }
    }

    public Box CreateBox(string productName, int width, int height, int length, string imgUrl)
    {
        var sql =
            @" INSERT INTO BoxFactory.box (product_name, width, height, length, box_img_url) VALUES (@productName, @width, @height, @length, @imgUrl) RETURNING *;";

        using (var conn = _dataSource.OpenConnection())
        {
            return conn.QueryFirst<Box>(sql, new { productName, width, height, length, imgUrl });
        }
    }

    public Box UpdateBox(int boxId, string productName, int width, int height, int length, string imgUrl)
    {
        var sql =
            @"UPDATE BoxFactory.box SET product_name = @productName, width = @width, height = @height, length = @length, box_img_url = @imgUrl WHERE box_id = @boxId RETURNING *;";

        using (var conn = _dataSource.OpenConnection())
        {
            return conn.QueryFirst<Box>(sql, new { boxId, productName, width, height, length, imgUrl });
        }
    }

    public void DeleteBox(int boxId)
    {
        var sql = @"DELETE FROM BoxFactory.box WHERE box_id = @boxId RETURNING *;";

        using (var conn = _dataSource.OpenConnection())
        {
            conn.QueryFirst<Box>(sql, new { boxId });
        }
    }
}