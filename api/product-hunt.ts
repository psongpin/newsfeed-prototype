import { NowRequest, NowResponse } from "@vercel/node";
import puppeteer from "puppeteer";

type ProductHuntItem = {
  url: string;
  title: string;
  description: string;
  imageUrl: string;
};

export default async (req: NowRequest, res: NowResponse) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.producthunt.com/");

  const ph_data: ProductHuntItem[] = await page.evaluate(() => {
    const data: ProductHuntItem[] = [];
    const todayPostlist = document.querySelectorAll(
      "ul.postsList_bc712:first-of-type li:nth-child(n+1):nth-child(-n+6)"
    );

    todayPostlist.forEach((elem) => {
      const scrapedItem: ProductHuntItem = {
        url: "",
        title: "",
        description: "",
        imageUrl: "",
      };
      try {
        scrapedItem.url = elem.querySelector("a").href;
        scrapedItem.title = elem.querySelector("h3").innerText;
        scrapedItem.description = elem.querySelector("p").innerText;
        scrapedItem.imageUrl = elem.querySelector("img").src;
      } catch (error) {}

      data.push(scrapedItem);
    });

    return data;
  });

  await browser.close();

  res.json(ph_data);
};
