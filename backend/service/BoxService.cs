using DefaultNamespace;
using infrastructure.BoxRepository;

namespace service;

public class BoxService
{

    private readonly BoxRepository _boxRepository;

    public BoxService(BoxRepository boxRepository)
    {
        _boxRepository = boxRepository;
    }

    public IEnumerable<Box> getAllBoxes()
    {
        return _boxRepository.GetAllBoxes();
    }

    public Box getBoxById(int boxId)
    {
        return _boxRepository.GetBoxById(boxId);
    }

    public IEnumerable<Box> SearchBoxes(string searchQuery)
    {
        return _boxRepository.SearchBoxes(searchQuery);
    }

    public Box createBox(string productName, int width, int height, int length, string imgUrl)
    {
        return _boxRepository.CreateBox(productName, width, height, length, imgUrl);
    }

    public Box updateBox(int boxId, string productName, int width, int height, int length, string imgUrl)
    {
        return _boxRepository.UpdateBox(boxId, productName, width, height, length, imgUrl);
    }

    public void deleteBox(int boxId)
    {
        _boxRepository.DeleteBox(boxId);
    }
}
