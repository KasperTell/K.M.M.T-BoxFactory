using Dapper;
using FluentAssertions;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using Newtonsoft.Json;
using NUnit.Framework;
using tests;
using Tests;

namespace TestNUnit;

[TestFixture]
public class DeleteBox : PageTest
{
    [TestCase("hello", "28", "7824", "1746", "LilleBox.com")]
    public async Task BoxCanSuccessfullyBeDeletedFromUi(string product_name, int width, int height, int length, string box_img_url)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            //Insert an article to remove from UI
            conn.QueryFirst<Box>(
                "INSERT INTO BoxFactory.box (product_name, width, height, length, box_img_url) VALUES (@product_name, @width, @height, @length, @box_img_url) RETURNING *;",
                new { product_name, width, height, length, box_img_url});
        }

        //ACT 
        await Page.GotoAsync(Helper.ClientAppBaseUrl);
        var card = Page.GetByTestId("card_" + product_name);
        await card.ClickAsync();
        await Page.GetByTestId("open_edit").ClickAsync();
        await Page.GetByTestId("delete_button").ClickAsync();
        await Page.GetByRole(AriaRole.Button, new() { Name = "Yes" }).ClickAsync(); //Clicking a confirm button
        await Page.GotoAsync(Helper.ClientAppBaseUrl); //Going back to feed, where we will make an expectation


        //ASSERT
        await Expect(card).Not.ToBeVisibleAsync(); //Article card is now nowhere to be found (notice the "Not" part)
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.ExecuteScalar<int>("SELECT COUNT(*) FROM BoxFactory.box;").Should()
                .Be(0); //And the article is also gone from the DB
        }
    }

    [TestCase("Hello", "28", "7824", "1746", "LilleBox.com")]
    public async Task BoxCanSuccessfullyBeDeletedFromHttpClient(string product_name, int width, int height, int length, string box_img_url)
    {
        //ARRANGE
        Helper.TriggerRebuild();
        //Insert an article to remove from UI
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            conn.QueryFirst<Box>(
                "INSERT INTO BoxFactory.box (product_name, width, height, length, box_img_url) VALUES (@product_name, @width, @height, @length, @box_img_url) RETURNING *;",
                new { product_name, width, height, length, box_img_url});
        }

        //ACT
        var httpResponse = await new HttpClient().DeleteAsync(Helper.ApiBaseUrl + "/1");
        
        //ASSERT
        await using (var conn = await Helper.DataSource.OpenConnectionAsync())
        {
            httpResponse.Should().BeSuccessful();
            conn.ExecuteScalar<int>("SELECT COUNT(*) FROM BoxFactory.box;").Should().Be(0); //Should be gone from DB
        }
    }
    
}