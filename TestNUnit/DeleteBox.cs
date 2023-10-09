namespace TestNUnit;

[TestFixture]
public class DeleteBox
{
    private BoxController _boxController;

    [SetUp]
    public void Setup()
    {
        _boxController = new BoxController();
    }

    [Test]
    public void Delete_ValidBoxId_ReturnsNoContent()
    {
        // Arrange
        int boxId = 123;

        // Act
        var result = _boxController.delete(boxId);

        // Assert
        Assert.That(result, Is.TypeOf<NoContentResult>());
    }

    [Test]
    public void Delete_InvalidBoxId_ThrowsException()
    {
        // Arrange
        int boxId = -1;

        // Assert
        Assert.Throws<Exception>(() => _boxController.delete(boxId));
    }
}