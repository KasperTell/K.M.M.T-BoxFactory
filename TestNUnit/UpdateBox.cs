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
    //API test: Now we're not using the frontend, so we're "isolating" from the API layer and down (just using HttpClient, no Playwright)
    [TestCase("Lille" , 2828, 2828, 2828, "LilleBox.com")]
    [TestCase("Mellem", 2828, 2828, 2828, "MellemBox.com")]
    [TestCase("Stor", 2828, 2828, 2828,  "StorBox.com")]
    [TestCase("MegetStor", 2828, 2828, 2828, "MegetStorBox.com")]

    public async Task BoxCanSuccessfullyBeUpdatedFromHttpRequest(string product_name, int width, int height, int length, string box_img_url)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            
            //Insert an article to be updated
            conn.Execute(
                "INSERT INTO BoxFactory.box (product_name, width, height, length, box_img_url) VALUES ('hardcodedProductName', 1, 5, 8, 'hardcodedBoxImgUrl') RETURNING *;");
        }

        var testBox = new Box()
            {box_id = 1, product_name = product_name, width = width, height = height, length = length, box_img_url = box_img_url};

        //ACT
            var httpResponse = await new HttpClient().PutAsJsonAsync(Helper.ApiBaseUrl + "/1", testBox);
            var boxFromResponseBody =
                JsonConvert.DeserializeObject<Box>(await httpResponse.Content.ReadAsStringAsync());
        //ASSERT
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.QueryFirst<Box>("SELECT * FROM BoxFactory.box;").Should()
                .BeEquivalentTo(boxFromResponseBody); //Should be equal to box found in DB
        }
    }
    //Here we're testing that the API returns a bad request response and no article is created when bad values are sent
    [TestCase("St", 40, 40, 40, "StorBox.com")]
    [TestCase("Meget Stor", 21, 7824, 1746, ".com")]
    public async Task ClientSideDataValidationShouldRejectBadValues(string product_name, int width, int height, int length, string box_img_url)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        var box = new Box(){box_id = 1, product_name = product_name, width = width, height = height, length = length, box_img_url = box_img_url};

        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
            
        {
            //Insert an article to update
            conn.QueryFirst<Box>(
                "INSERT INTO BoxFactory.box (product_name, width, height, length, box_img_url) VALUES " +
                "(@product_name, @width, @height, @length, @box_img_url) RETURNING *;", box);
        }
            //ACT
        await Page.GotoAsync(Helper.ClientAppBaseUrl);
        await Page.GetByTestId("card_" + product_name).ClickAsync();
        await Page.GetByTestId("update_button").ClickAsync();
        await Page.GetByTestId("update_product_name_form").Locator("input").FillAsync(product_name);
        await Page.GetByTestId("update_width_form").Locator("input").FillAsync(width.ToString());
        await Page.GetByTestId("update_height_form").Locator("input").FillAsync(height.ToString());
        await Page.GetByTestId("update_length_form").Locator("input").FillAsync(length.ToString());
        await Page.GetByTestId("update_box_img_url_form").Locator("input").FillAsync(box_img_url);
        await Expect(Page.GetByTestId("update_submit_form")).ToHaveAttributeAsync("aria-disabled", "true");
    }
    
    //Here we're testing that the API returns a bad request response and artiel is not updated when presented with bad values
    [TestCase("St", 40, 40, 40, "StorBox.com")]
    [TestCase("Meget Stor", 21, 7824, 1746, ".com")]
    public async Task ServerSideDataValidationShouldRejectBadValues(string product_name, int width, int height, int length, string box_img_url)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            //Insert an box to be updated
            conn.QueryFirst<Box>(
                "INSERT INTO BoxFactory.box (product_name, width, height, length, box_img_url) VALUES ('hardcodedProductName',143431, 3490, 3498, 'hardcodedBoxImgUrl') RETURNING *;");
        }
        
        var testBox = new Box()
            {box_id = 1, product_name = product_name, width = width, height = height, length = length, box_img_url = box_img_url};

        //ACT
        var httpResponse = await new HttpClient().PutAsJsonAsync(Helper.ApiBaseUrl, testBox);
        
        //ASSERT
        httpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);

    }
    
}