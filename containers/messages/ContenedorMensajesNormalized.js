import { normalize, schema } from "normalizr";
import fs from "fs";

export default class ContenedorMensajesNormalized {
  constructor(fileName) {
    this.fileName = fileName;
  }

  async save(message) {
    try {
      if (!fs.existsSync(this.fileName)) {
        let array = [];
        const messageAdapted = {
          ...message,
          id: 0,
        };
        array.push(messageAdapted);
        await fs.promises.writeFile(
          this.fileName,
          JSON.stringify(array),
          "utf-8"
        );
      } else {
        const data = await fs.promises.readFile(this.fileName, "utf-8");
        const fileDataParsed = JSON.parse(data);
        let fileArray = fileDataParsed;
        const lastId = fileDataParsed[fileDataParsed.length - 1].id;
        const lastItemId = lastId === undefined ? 0 : lastId + 1;
        const messageAdapted = {
          ...message,
          id: lastItemId,
        };
        fileArray.push(messageAdapted);
        await fs.promises.writeFile(
          this.fileName,
          JSON.stringify(fileArray),
          "utf-8"
        );
      }
      return true;
    } catch (err) {
      return null;
    }
  }

  async getAllMessages() {
    try {
      const data = await fs.promises.readFile(this.fileName, "utf-8");
      this.dataToNormalize = {
        id: "1",
        messages: JSON.parse(data),
      };
      this.authorSchema = new schema.Entity(
        "authors",
        {},
        { idAttribute: "email" }
      );
      this.messageSchema = new schema.Entity("message", {
        author: this.authorSchema,
      });
      this.messagesSchema = new schema.Entity("messages", {
        messages: [this.messageSchema],
      });
      const dataNormalized = normalize(
        this.dataToNormalize,
        this.messagesSchema
      );
      return dataNormalized;
    } catch (err) {
      logger.error(`Error in getting messages ${err}`)
      return null;
    }
  }
};
