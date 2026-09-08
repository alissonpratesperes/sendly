import * as path from 'path';

export function imageUrlToContent(content: any, file?: Express.Multer.File): any {
  if (!file) {
    if (typeof content === "string") {
      try {
        return JSON.parse(content);
      } catch {
        return content;
      }
    }

    return content;
  }

  let parsedContent = content;

  if (typeof content === "string") {
    try {
      parsedContent = JSON.parse(content);
    } catch {
      parsedContent = {};
    }
  }
  if (!parsedContent) {
    parsedContent = { body: [] };
  }

  const imagePath = path.resolve(file.path);

  if (parsedContent.header?.image !== undefined) {
    parsedContent.header.image = imagePath;

    return parsedContent;
  }
  if (!Array.isArray(parsedContent.body)) {
    parsedContent.body = [];
  }

  const imageBlock = parsedContent.body.find((block: any) => block.type === "image");

  if (imageBlock) {
    imageBlock.url = imagePath;
  } else {
    parsedContent.body.push({
      type: "image",
      url: imagePath,
    });
  }

  return parsedContent;
}
