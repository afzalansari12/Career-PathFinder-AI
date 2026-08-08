import PDFParser from "pdf2json";

export async function extractPdfText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData: any) => {
        reject(errData?.parserError || errData);
      });
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      let text = "";

      for (const page of pdfData.Pages) {
        for (const item of page.Texts) {
          for (const run of item.R) {
            text += decodeURIComponent(run.T) + " ";
          }
        }
        text += "\n";
      }

      resolve(text);
    });

    pdfParser.parseBuffer(buffer);
  });
}