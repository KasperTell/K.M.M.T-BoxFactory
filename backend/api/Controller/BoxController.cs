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
    [Route("/box/all")]
    public IEnumerable<Box> getAllBoxes()
    {
        return _boxService.getAllBoxes();
    }

    [HttpGet]
    [Route("/box/{boxId}")]
    public Box getBoxById([FromRoute] int boxId)
    {
        return _boxService.getBoxById(boxId);
    }

    [HttpGet]
    [Route("/box")]
    public IEnumerable<Box> SearchBoxes([FromQuery] string searchQuery )
    {
        return _boxService.SearchBoxes(searchQuery);
    } 

    [HttpPost]
    [Route("/box")]
    public Box post([FromBody] Box box)
    {
        return _boxService.createBox(box.product_name, box.width, box.height, box.length, box.box_img_url);
    }

    [HttpPut]
    [Route("/box/{boxId}")]
    public Box put([FromRoute] int boxId, [FromBody] Box box)
    {
        return _boxService.updateBox(boxId, box.product_name, box.width, box.height, box.length, box.box_img_url);
    }

    [HttpDelete]
    [Route("/box/{boxId}")]
    public void delete([FromRoute] int boxId)
    {
        _boxService.deleteBox(boxId);
    }
    
}