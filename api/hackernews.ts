import { NowRequest, NowResponse } from "@vercel/node";
import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

type Story = {
  title: string;
  link: string;
  author: string;
};

export default async (req: NowRequest, res: NowResponse) => {
  const url = "https://news.ycombinator.com/";
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
    defaultViewport: chrome.defaultViewport,
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });

  const data = await page.evaluate(() => {
    const data: Story[] = [];

    Array.from(document.querySelectorAll<HTMLTableRowElement>(".athing"))
      .slice(0, 6)
      .map((elem) => {
        const story: Story = { title: "", link: "", author: "" };

        const titleElement = elem.querySelector<HTMLAnchorElement>(
          ".storylink"
        );

        story.title = titleElement ? titleElement.innerText : "";
        story.link = titleElement ? titleElement.href : "";
        data.push(story);
        return null;
      });

    Array.from(
      document.querySelectorAll<HTMLTableRowElement>(
        ".athing + tr:not(.spacer)"
      )
    )
      .slice(0, 6)
      .map((elem, index) => {
        const hnUserElem = elem.querySelector<HTMLAnchorElement>(".hnuser");

        data[index].author = hnUserElem ? hnUserElem.innerText : "";
        return null;
      });
    return data;
  });

  await browser.close();

  res.json(data);
};
