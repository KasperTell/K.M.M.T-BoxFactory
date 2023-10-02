using DefaultNamespace;
using Microsoft.AspNetCore.Mvc;
using service;

namespace K.M.M.T_BoxFactory.Controller;

public class BoxController : ControllerBase
{
    private readonly BoxService _boxService;

    public BoxController(BoxService boxService)
    {
        _boxService = boxService;
    }

    [HttpGet]
    [Route("/box")]
    public IEnumerable<Box> getAllBoxes()
    {
        return _boxService.getAllBoxes();
    }
}