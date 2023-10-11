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

namespace Playwright;

[TestFixture]
public class CreateTests : PageTest
{
    //Here we're using the entire stack from UI and down (using Playwright)
    [TestCase("Lille", 28, 2828, 2828, "LilleBox.com")]
    [TestCase("Mellem", 28, 2828, 2828, "MellemBox.com")]
    [TestCase("Stor", 28, 2828, 2828, "StorBox.com")]
    [TestCase("MegetStor", 28, 2828, 2828, "MegetStorBox.com")]
    public async Task BoxCanSuccessfullyBeCreatedFromUi(string product_name, int width, int height, int length, string box_img_url)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        
        //ACT
        await Page.GotoAsync(Helper.ClientAppBaseUrl);
        await Page.GetByTestId("create_button").ClickAsync();
        await Page.GetByTestId("create_product_name_form").Locator("input").FillAsync(product_name);
        await Page.GetByTestId("create_width_form").Locator("input").FillAsync(width.ToString());
        await Page.GetByTestId("create_height_form").Locator("input").FillAsync(height.ToString());
        await Page.GetByTestId("create_length_form").Locator("input").FillAsync(length.ToString());
        await Page.GetByTestId("create_box_img_url_form").Locator("input").FillAsync(box_img_url);
        await Page.GetByTestId("create_submit_form").ClickAsync();
        
        //ASSERT
        await Expect(Page.GetByTestId("card_" + product_name)).ToBeVisibleAsync(); //Exists in UI after creation
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            var expected = new Box()
            {
                box_id = 1,
                product_name = product_name,
                width = width,
                height = height,
                length = length,
                box_img_url = box_img_url
            }; //Box object from test case

            conn.QueryFirst<Box>("SELECT * FROM BoxFactory.box;").Should()
                .BeEquivalentTo(expected); //Should be equal to article found in DB
        }
        
    }
    
    [TestCase("Lille" , 2828, 2828, 2828, "LilleBox.com")]
    [TestCase("Mellem", 2828, 2828, 2828, "MellemBox.com")]
    [TestCase("Stor", 2828, 2828, 2828,  "StorBox.com")]
    [TestCase("MegetStor", 28, 2828, 2828, "MegetStorBox.com")]
    public async Task BoxCanSuccessfullyBeCreatedFromHttpClient(string product_name, int width, int height, int length, string box_img_url)
    {
        Helper.TriggerRebuild();
        var testBox = new Box()
        {
            box_id = 1,
            product_name = product_name,
            width = width,
            height = height,
            length = length,
            box_img_url = box_img_url
        };
        //ACT
        var httpResponse = await new HttpClient().PostAsJsonAsync(Helper.ApiBaseUrl, testBox);
        var boxFromResponseBody = JsonConvert.DeserializeObject<Box>(await httpResponse.Content.ReadAsStringAsync());

        //ASSERT
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.QueryFirst<Box>("SELECT * FROM BoxFactory.box;").Should().BeEquivalentTo(boxFromResponseBody); //Should be equal to article found in DB
        }
    }

    //Here we're testing that the API returns a bad request response and no article is created when bad values are sent
    [TestCase("St", 40, 40, 40, "StorBox.com")]
    [TestCase("Meget Stor", 21, 7824, 1746, ".com")]
    public async Task ServerSideDataValidationShouldRejectBadValues(string product_name, int width, int height, int length, string box_img_url)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        var testBox = new Box()
        {
           box_id = 1, product_name = product_name, width = width, height = height, length = length, box_img_url = box_img_url
        };

        //ACT
        var httpResponse = await new HttpClient().PostAsJsonAsync(Helper.ApiBaseUrl, testBox);


        //ASSERT
        httpResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.ExecuteScalar<int>("SELECT COUNT(*) FROM BoxFactory.box;").Should()
                .Be(0); //DB should be empty when create failed
        }
    }
}
