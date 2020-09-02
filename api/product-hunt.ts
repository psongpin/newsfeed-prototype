import { NowRequest, NowResponse } from "@vercel/node";
import puppeteer from "puppeteer";

type ProductHuntItem = {
  url: string;
  title: string;
  description: string;
  imageUrl: string;
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

export default async (req: NowRequest, res: NowResponse) => {
  const ph_url = "https://www.producthunt.com";
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(ph_url, { waitUntil: "load" });

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
        const linkElem = elem.querySelector("a");
        const titleElem = elem.querySelector("h3");
        const descElem = elem.querySelector("p");
        const imageElem = elem.querySelector("img");

        scrapedItem.url = linkElem ? linkElem.href : "";
        scrapedItem.title = titleElem ? titleElem.innerText : "";
        scrapedItem.description = descElem ? descElem.innerText : "";
        scrapedItem.imageUrl = imageElem ? imageElem.src : "test";
      } catch (error) {
        throw error;
      }

      data.push(scrapedItem);
    });

    return data;
  });

  await browser.close();

  res.json(ph_data);
};
