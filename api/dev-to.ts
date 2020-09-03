import { NowRequest, NowResponse } from "@vercel/node";
import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

type Story = {
  title: string;
  link: string;
  author: string;
};

export default async (req: NowRequest, res: NowResponse) => {
  const url = "https://dev.to/";
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
    defaultViewport: chrome.defaultViewport,
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });

  const featuredStory: Story = await page.evaluate(() => {
    const item1: Story = { title: "", link: "", author: "" };

    item1.title =
      document.querySelector<HTMLHeadingElement>(
        ".crayons-story--featured .crayons-story__title"
      )?.innerText || "";

    item1.link =
      document.querySelector<HTMLAnchorElement>(
        ".crayons-story--featured .crayons-story__title a"
      )?.href || "";

    item1.author =
      document.querySelector<HTMLAnchorElement>(
        ".crayons-story--featured .crayons-story__secondary"
      )?.innerText || "";

    return item1;
  });

  const substories: Story[] = await page.evaluate(() => {
    const stories: Story[] = [];

    Array.from(document.querySelectorAll(".substories .crayons-story"))
      .slice(0, 5)
      .map((elem) => {
        const item: Story = { title: "", link: "", author: "" };

        item.title =
          elem.querySelector<HTMLHeadingElement>(".crayons-story__title")
            ?.innerText || "";

        item.link =
          elem.querySelector<HTMLAnchorElement>(".crayons-story__title a")
            ?.href || "";

        item.author =
          elem.querySelector<HTMLAnchorElement>(".crayons-story__secondary")
            ?.innerText || "";

        stories.push(item);
        return null;
      });

    return stories;
  });

  await browser.close();

  res.json([featuredStory, ...substories]);
};
