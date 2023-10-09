using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace tests;

public class Box
{
    public int box_id { get; set; }
    [MinLength(3)]
    public string product_name { get; set;  }
    
    public int width { get; set; }
    public int height { get; set; }
    public int length { get; set; }
    [MinLength(5)]
    public string box_img_url { get; set; }
}