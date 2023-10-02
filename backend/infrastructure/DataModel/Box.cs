using System.ComponentModel.DataAnnotations;

namespace DefaultNamespace;

public class Box
{
    public int box_id { get; set; }
    public string product_name { get; set;  }
    public int width { get; set; }
    public int height { get; set; }
    public int length { get; set; }
    public string box_img_url { get; set; }
}