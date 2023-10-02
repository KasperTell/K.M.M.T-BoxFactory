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
        return _boxRepository.getAllBoxes();
    }

}
