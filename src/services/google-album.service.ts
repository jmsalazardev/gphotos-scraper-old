import { Service } from "typedi";
import axios from "axios";
import { BrowserService } from "./browser.service";
import { GoogleAlbum } from "../interfaces/google-album.interface";
import * as pageEvaluator from "./page-evaluator";
import { GooglePhoto } from "../interfaces/google-photo.interface";

@Service()
export class GoogleAlbumService {
  constructor(private readonly browserService: BrowserService) {}

  async getAlbum(url: string): Promise<GoogleAlbum | undefined> {
    // const spinner = ora('Loading resources').start();

    const page = await this.browserService.newPage();

    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });

    await page.waitForNavigation({
      waitUntil: "networkidle2",
    });
    return page.evaluate(pageEvaluator.getAlbum) as any as GoogleAlbum;
  }

  async getPhoto(
    photoId: string,
    key: string
  ): Promise<GooglePhoto | undefined> {
    const rpcid = "fDcn4b";
    const bodyData = `f.req=%5B%5B%5B%22${rpcid}%22,%22%5B%5C%22${photoId}%5C%22,1,%5C%22${key}%5C%22%5D%22,null,%221%22%5D%5D%5D%5D`;
    const res = await axios.post(
      "https://photos.google.com/_/PhotosUi/data/batchexecute",
      bodyData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      }
    );
    let data = res.data.replace(`)]}'`, "");
    data = JSON.parse(data);
    data = JSON.parse(data[0][2]);
    const [id, description, filename, createdAt, tmp1, size, width, height] =
      data[0];

    return {
      id,
      description,
      filename,
      createdAt,
      size,
      width,
      height,
    };
  }
}
