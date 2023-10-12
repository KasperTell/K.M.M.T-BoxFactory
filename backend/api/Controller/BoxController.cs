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
        try
        {
            return _boxService.getAllBoxes();
        }
        catch (Exception e)
        {
           Console.WriteLine(e);
           throw new Exception("Error when getting all boxes", e);
        }
    }

    [HttpGet]
    [Route("/box/{boxId}")]
    public Box getBoxById([FromRoute] int boxId)
    {
        try
        {
            return _boxService.getBoxById(boxId);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw new Exception("Error when getting box based on ID", e);
        }
    }

    [HttpGet]
    [Route("/box")]
    public IEnumerable<Box> SearchBoxes([FromQuery] string searchQuery )
    {
        try
        {
            return _boxService.SearchBoxes(searchQuery);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw new Exception("Error when searching", e);
        }
    }

    [HttpPost]
    [Route("/box")]
    public object post([FromBody] Box box)
    {
        if (box.product_name.Length >= 3)
        {
            if (box.box_img_url.Length >= 5)
            {
                try
                {
                    return _boxService.createBox(box.product_name, box.width, box.height, box.length, box.box_img_url);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw new Exception("Error when creating a box", e);
                }
            }

            return BadRequest(400);
        }

        return BadRequest(400);
    }

    [HttpPut]
    [Route("/box/{boxId}")]
    public Object put([FromRoute] int boxId, [FromBody] Box box)
    {
        if (box.product_name.Length >= 3)
        {
            if (box.box_img_url.Length >= 5)
            {
                try
                {
                    return _boxService.updateBox(boxId, box.product_name, box.width, box.height, box.length,
                        box.box_img_url);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw new Exception("Error when updating a box", e);
                }
            }
            return BadRequest(400);
        }
        return BadRequest(400);
    }

    [HttpDelete]
    [Route("/box/{boxId}")]
    public void delete([FromRoute] int boxId)
    {
        try
        {
            _boxService.deleteBox(boxId);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw new Exception("Error when deleting a box", e);
        }
    }
}
