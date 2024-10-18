import { modifyHtml } from "html-modifier";

const htmlTempalte = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      html,
      body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }

      .iframe-wrapper {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .iframe-webview {
        width: 100%;
        height: 100%;
        border: none;
      }
    </style>
  </head>

  <body>
    <div class="iframe-wrapper">
      <iframe
        class="iframe-webview"
        frameborder="0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-downloads"
        allow="cross-origin-isolated; autoplay; clipboard-read; clipboard-write"
      ></iframe>
    </div>
  </body>
</html>
`

export const getTemplate = async (serverUrl: string) => {
  return await modifyHtml(htmlTempalte, {
    onopentag(name, attribs) {
      if (name === "iframe") attribs.src = serverUrl;
      return { name, attribs };
    },
  });
};
