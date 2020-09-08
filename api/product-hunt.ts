import { NowRequest, NowResponse } from "@vercel/node";
import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

type ProductHuntItem = {
  url: string;
  title: string;
  description: string;
  imageUrl: string;
};

const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default async (req: NowRequest, res: NowResponse) => {
  const ph_url = "https://www.producthunt.com";
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
    defaultViewport: { ...chrome.defaultViewport, height: 3000 },
  });
  const page = await browser.newPage();
  await page.goto(ph_url, { waitUntil: "networkidle0" });

  await page.evaluate(() => {
    const firstProductList = document.querySelector<HTMLUListElement>(
      "ul.postsList_bc712"
    );

    if (!firstProductList) return null;

    Array.from(
      firstProductList.querySelectorAll<HTMLLIElement>(
        "li:nth-child(n+1):nth-child(-n+6)"
      )
    ).map((elem) => {
      if (elem) {
        window.scrollTo(0, elem.getBoundingClientRect().top + 50);
      }
      return null;
    });
  });

  await wait(500);

  const ph_data: ProductHuntItem[] = await page.evaluate(() => {
    const data: ProductHuntItem[] = [];

    const firstProductList = document.querySelector<HTMLUListElement>(
      "ul.postsList_bc712"
    );

    if (!firstProductList) return data;

    Array.from(
      firstProductList.querySelectorAll<HTMLLIElement>(
        "li:nth-child(n+1):nth-child(-n+6)"
      )
    ).map((elem) => {
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
        scrapedItem.imageUrl = imageElem ? imageElem.src : "";
      } catch (error) {
        throw error;
      }

      data.push(scrapedItem);
      return null;
    });

    return data;
  });

  await browser.close();

  res.json(ph_data);
};
