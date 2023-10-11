using System.Net;
using System.Net.Http.Json;
using Dapper;
using FluentAssertions;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using Newtonsoft.Json;
using NUnit.Framework;
using tests;
using Tests;
namespace PlaywrightTests;

[TestFixture]
public class UpdateTests : PageTest
{
    //Here we're using the entire stack from UI and down (using Playwright)
  [TestCase("MegetStor", 28, 2828, 2828, "MegetStorBox.com")]
    public async Task BoxCanSuccessfullyBeUpdated(string product_name, int width, int height, int length, string box_img_url)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            //Insert an article to update
            conn.QueryFirst<Box>(
                "INSERT INTO BoxFactory.box (product_name, width, height, length, box_img_url) VALUES (@product_name, @width, @height, @length, @box_img_url) RETURNING *;",
                new { product_name, width, height, length, box_img_url});
        }

        //ACT
        await Page.GotoAsync(Helper.ClientAppBaseUrl);
        await Page.GetByTestId("update_button").ClickAsync();
        await Page.GetByTestId("update_product_name_form").Locator("input").FillAsync(product_name);
        await Page.GetByTestId("update_width_form").Locator("input").FillAsync(width.ToString());
        await Page.GetByTestId("update_height_form").Locator("input").FillAsync(height.ToString());
        await Page.GetByTestId("update_length_form").Locator("input").FillAsync(length.ToString());
        await Page.GetByTestId("update_box_img_url_form").Locator("input").FillAsync(box_img_url);
        await Page.GetByTestId("update_submit_form").ClickAsync();


        //ASSERT
        //Box in DB is as is expected
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        { 
            conn.QueryFirst<Box>("SELECT * FROM BoxFactory.box;").Should()
                         .BeEquivalentTo(new Box()
            {box_id = 1, product_name = product_name, width = width, height = height, length = length, box_img_url = box_img_url});
        }
        //Box with new product_name is present on feed after update
        await Expect(Page.GetByTestId("card_" + product_name)).ToBeVisibleAsync();
    }
        
}